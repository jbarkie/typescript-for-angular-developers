import { describe, it, expect } from 'vitest';

// 07 — as const and satisfies
//
// Two small tools that change how TypeScript sees your values. They exist
// because of the same underlying tension: you want the compiler to infer your
// values as *specifically* as possible, but default inference often widens
// more than you'd like.
//
// Learning when to reach for each is the difference between fighting the
// compiler and thinking with it.

describe('the widening problem', () => {
  it('a plain array is inferred as mutable — the specific values are lost', () => {
    const COUNT_BY_VALUES = [1, 3, 5];
    // TypeScript infers: `number[]`.
    // You can tell, because the compiler lets you mutate it:
    COUNT_BY_VALUES.push(7);
    COUNT_BY_VALUES[0] = 99;

    expect(COUNT_BY_VALUES.length).toBe(4);
    expect(COUNT_BY_VALUES[0]).toBe(99);

    // Useful when you want a growable list. A problem when you wanted the
    // specific values 1, 3, 5 to mean something to the type system — for
    // example, to derive a union type `1 | 3 | 5` from them.
  });
});

describe('as const — freeze inference to the most specific form', () => {
  it('as const turns an array into a readonly tuple of literal values', () => {
    const COUNT_BY_VALUES = [1, 3, 5] as const;
    // TypeScript now infers: `readonly [1, 3, 5]`.
    // Uncomment the next line. TypeScript will refuse — readonly tuples have
    // no `.push` method on their type.
    //
    // COUNT_BY_VALUES.push(7);

    // And you can derive the element-union type from it.
    // TODO: derive `CountByValue` as the element type of COUNT_BY_VALUES.
    //       Hint: `typeof COUNT_BY_VALUES[number]` — read the array, get the union.
    type CountByValue = number; // fix this

    const v1: CountByValue = 1;
    const v2: CountByValue = 3;
    // @ts-expect-error — 2 is not one of 1 | 3 | 5
    const v3: CountByValue = 2;

    expect([v1, v2]).toEqual([1, 3]);
  });

  it('as const works on objects too — every string becomes its literal', () => {
    const SECTIONS = {
      apps: 'Applications',
      libs: 'Libraries',
      services: 'Services',
    } as const;

    // Without `as const`: SECTIONS.apps would have type `string`.
    // With it: SECTIONS.apps has type `'Applications'` — the literal.
    //
    // And the whole object is readonly.

    // TODO: derive `SectionKey` as `keyof typeof SECTIONS`.
    //       It should be the union 'apps' | 'libs' | 'services'.
    type SectionKey = string; // fix this

    const k1: SectionKey = 'apps';
    // @ts-expect-error — 'widgets' is not a key of SECTIONS
    const k2: SectionKey = 'widgets';

    expect(k1).toBe('apps');
  });
});

describe('the annotation trap', () => {
  it('adding a type annotation checks the value — and widens it in the process', () => {
    type CatalogSection = {
      label: string;
      icon: string;
    };
    type SectionsMap = Record<string, CatalogSection>;

    // Annotating `sections` with `SectionsMap` gives us type-checking.
    // But it also *widens* the value to match that annotation.
    const sections: SectionsMap = {
      apps: { label: 'Applications', icon: 'cube' },
      libs: { label: 'Libraries', icon: 'book' },
    };

    // The keys of `sections` are inferred as `string`, not 'apps' | 'libs'.
    // Any string is a valid key-access — including typos.
    const real = sections['apps']; // ok, returns CatalogSection
    const oops = sections['aaps']; // ALSO ok at the type level, returns undefined at runtime

    expect(real?.label).toBe('Applications');
    expect(oops).toBeUndefined();

    // We got checking. We lost specificity. That's the trade-off with annotation.
  });
});

describe('satisfies — check without widening', () => {
  // Introduced in TypeScript 4.9. This is the fix for the annotation trap.
  // `satisfies SomeType` does two things:
  //   1. Checks that the value is assignable to SomeType (same as an annotation would)
  //   2. Keeps the value's *inferred* type — literals, readonly-ness, key set

  it('satisfies keeps literal types while still type-checking the shape', () => {
    type CatalogSection = {
      label: string;
      icon: string;
    };

    const sections = {
      apps: { label: 'Applications', icon: 'cube' },
      libs: { label: 'Libraries', icon: 'book' },
    } satisfies Record<string, CatalogSection>;

    // Now the keys are inferred specifically:
    // TODO: derive `SectionKey` as `keyof typeof sections`.
    //       It should be the union 'apps' | 'libs' — not just `string`.
    type SectionKey = string; // fix this

    const k1: SectionKey = 'apps';
    // @ts-expect-error — 'services' is not a key of this sections object
    const k2: SectionKey = 'services';

    expect(k1).toBe('apps');
    expect(sections.apps.label).toBe('Applications');
  });

  it('satisfies catches the mistakes an annotation would catch', () => {
    type CatalogSection = {
      label: string;
      icon: string;
    };

    const bad = {
      apps: { label: 'Applications', icon: 'cube' },
      // @ts-expect-error — the 'libs' entry is missing the required `icon` property
      libs: { label: 'Libraries' },
    } satisfies Record<string, CatalogSection>;

    // satisfies gave us the check. If we had used inference alone, the compiler
    // would have been silent here — and the problem would have surfaced at a
    // usage site, much later.
    expect(true).toBe(true);
  });
});

describe('as const satisfies — the combined form', () => {
  it('as const plus satisfies gives you both specificity and shape-checking', () => {
    type CatalogSection = { label: string; icon: string };

    const SECTIONS = {
      apps: { label: 'Applications', icon: 'cube' },
      libs: { label: 'Libraries', icon: 'book' },
      services: { label: 'Services', icon: 'cloud' },
    } as const satisfies Record<string, CatalogSection>;

    // All of the following hold:
    //   - SECTIONS.apps.label has type 'Applications' (literal, not string)
    //   - the keys are 'apps' | 'libs' | 'services' (not string)
    //   - the whole thing is deeply readonly
    //   - the shape was checked against Record<string, CatalogSection>
    //
    // This is the shape a team-wide config object often wants.

    // TODO: derive a union of the section labels (e.g. 'Applications' | 'Libraries' | 'Services').
    //       Hint: `typeof SECTIONS[SectionKey]['label']` — index by key, then by property.
    type SectionKey = keyof typeof SECTIONS;
    type SectionLabel = string; // fix this

    const l1: SectionLabel = 'Applications';
    // @ts-expect-error — 'Widgets' is not one of the frozen labels
    const l2: SectionLabel = 'Widgets';

    // Uncomment the next line. TypeScript will refuse — SECTIONS is readonly at every level.
    // (`as const` is a compile-time check. At runtime, JavaScript would let the mutation through.)
    //
    // SECTIONS.apps.label = 'Changed';

    expect(l1).toBe('Applications');
    expect(SECTIONS.apps.label).toBe('Applications');
  });

  // Going deeper:
  //   `satisfies` is one of the more quietly important additions to TypeScript
  //   in recent years. It replaces a lot of patterns where people used to write
  //   elaborate helper functions just to preserve inference.
  //   Ask your AI: "before `satisfies` landed in TS 4.9, how did people preserve
  //   literal inference on a config object while still type-checking it? Show
  //   me the old pattern and explain what `satisfies` improved."
});
