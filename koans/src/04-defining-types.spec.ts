import { describe, it, expect } from 'vitest';

// 04 — Defining Types
//
// So far you have used types TypeScript hands you (`string`, `number`, `boolean`)
// and you have annotated a few object shapes inline. This file is where you
// start building your own vocabulary — naming the shapes of your domain.
//
// The running example from here on is a software catalog: a company's list of
// approved applications, libraries, and services. We will build up the types
// that describe it.

describe('type aliases — giving a shape a name', () => {
  it('a type alias creates a reusable name for a shape', () => {
    // TODO: define a type alias named `CatalogEntry` with the properties
    //       `name: string` and `vendor: string`.
    // type CatalogEntry = ...

    // Uncomment the following lines once the type exists:
    // const editor: CatalogEntry = { name: 'Editor Pro', vendor: 'Acme' };
    // expect(editor.name).toBe('Editor Pro');
    expect(true).toBe(true); // remove this line once the real assertions are active
  });
});

describe('literal types — narrowing a type to specific values', () => {
  it('a string literal type allows exactly one value', () => {
    // This is unusual at first — but very useful when composed into unions.
    const status: 'approved' = 'approved';
    // @ts-expect-error — 'approved' is the only acceptable value
    const wrongStatus: 'approved' = 'pending';
    expect(status).toBe('approved');
  });

  it('literal types combine into unions — the workhorse pattern', () => {
    // TODO: define `Status` as a union of three literal strings:
    //       'approved', 'under-review', 'deprecated'
    type Status = string; // fix this

    const s1: Status = 'approved';
    const s2: Status = 'under-review';
    const s3: Status = 'deprecated';
    // @ts-expect-error — 'rejected' is not one of the allowed values
    const s4: Status = 'rejected';

    expect([s1, s2, s3]).toEqual(['approved', 'under-review', 'deprecated']);
  });

  // Going deeper:
  //   Literal unions give you compiler-enforced autocomplete for small, finite
  //   sets of values — a lighter, more portable alternative to `enum`. The
  //   TypeScript team generally discourages `enum` now.
  //   Ask your AI: "What are the trade-offs between a string literal union
  //   and a TypeScript enum, and why is the community moving toward unions?"
});

describe('union types — "this or that"', () => {
  it('a value can be one of several types', () => {
    // TODO: type `id` so it can be either a string OR a number.
    let id: string = '';

    id = 'abc-123';
    id = 42;
    expect(typeof id).toBe('number');
  });

  it('using a union value requires narrowing before type-specific operations', () => {
    function describeId(id: string | number): string {
      // TODO: check whether `id` is a string, and if so return `id: ` followed by the uppercase version.
      //       Otherwise return `id: ` followed by the id as-is.
      //       Hint: `typeof id === 'string'`
      return '';
    }

    expect(describeId('abc-123')).toBe('id: ABC-123');
    expect(describeId(42)).toBe('id: 42');
  });
});

describe('intersection types — combining shapes with &', () => {
  it('& produces a type that has the properties of both', () => {
    type HasName = { name: string };
    type HasPrice = { price: number };

    // TODO: define `PricedNamedThing` as the intersection of HasName and HasPrice.
    type PricedNamedThing = HasName; // fix this

    const editor: PricedNamedThing = { name: 'Editor Pro', price: 99 };
    expect(editor.name).toBe('Editor Pro');
    expect(editor.price).toBe(99);
  });

  it('intersections compose naturally with other type operations', () => {
    type CatalogEntry = { name: string; vendor: string };
    type Approved = { status: 'approved'; approvedAt: string };

    // TODO: define `ApprovedCatalogEntry` as the intersection of `CatalogEntry` and `Approved`.
    type ApprovedCatalogEntry = CatalogEntry;

    const entry: ApprovedCatalogEntry = {
      name: 'Editor Pro',
      vendor: 'Acme',
      status: 'approved',
      approvedAt: '2025-01-15',
    };

    expect(entry.status).toBe('approved');
  });
});

describe('discriminated unions — the real payoff', () => {
  // This is one of TypeScript's best features for modeling real domains.
  // A "discriminated union" is a union of object types where each member shares
  // a common property (the *discriminant*) with a different literal value.
  // TypeScript can then figure out which variant you're in based on that property.

  // Different kinds of software need different fields. An application has a
  // vendor and a license count. A library has a version and a license type.
  // A service has a URL and a monthly cost. They all share a `kind` field.

  type ApplicationEntry = {
    kind: 'application';
    name: string;
    vendor: string;
    licenseCount: number;
  };

  type LibraryEntry = {
    kind: 'library';
    name: string;
    version: string;
    license: 'MIT' | 'Apache-2.0' | 'proprietary';
  };

  type ServiceEntry = {
    kind: 'service';
    name: string;
    url: string;
    monthlyCost: number;
  };

  type CatalogItem = ApplicationEntry | LibraryEntry | ServiceEntry;

  it('the discriminant tells TypeScript which variant you have', () => {
    const item: CatalogItem = {
      kind: 'application',
      name: 'Editor Pro',
      vendor: 'Acme',
      licenseCount: 50,
    };

    // Inside the `if` block, TypeScript knows `item` is specifically an ApplicationEntry.
    // TODO: inside the block, return the vendor. Outside, return 'not an app'.
    function vendorOrNothing(i: CatalogItem): string {
      if (i.kind === 'application') {
        return '';
      }
      return '';
    }

    expect(vendorOrNothing(item)).toBe('Acme');
    expect(
      vendorOrNothing({ kind: 'library', name: 'lodash', version: '4.17.21', license: 'MIT' }),
    ).toBe('not an app');
  });

  it('switch over the discriminant handles every variant cleanly', () => {
    // TODO: complete the switch below. For each variant, return a short summary.
    //       'application' → `${name} (${licenseCount} licenses)`
    //       'library'     → `${name} v${version}`
    //       'service'     → `${name} — $${monthlyCost}/mo`
    function summarize(item: CatalogItem): string {
      switch (item.kind) {
        case 'application':
          return '';
        case 'library':
          return '';
        case 'service':
          return '';
      }
    }

    expect(
      summarize({ kind: 'application', name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 }),
    ).toBe('Editor Pro (50 licenses)');

    expect(
      summarize({ kind: 'library', name: 'lodash', version: '4.17.21', license: 'MIT' }),
    ).toBe('lodash v4.17.21');

    expect(
      summarize({ kind: 'service', name: 'Notifier', url: 'https://ntfy.sh', monthlyCost: 12 }),
    ).toBe('Notifier — $12/mo');
  });

  it('the `never` type catches missed variants at compile time', () => {
    // `never` is TypeScript's way of saying "this branch cannot be reached."
    // If you exhaust every variant, the default case has type `never`.
    // If someone later adds a new variant without updating this function,
    // the compiler will complain here. It's a compile-time alarm bell.

    function assertNever(x: never): never {
      throw new Error(`Unhandled variant: ${JSON.stringify(x)}`);
    }

    // TODO: add `default: return assertNever(item);` to the switch below.
    //       Then uncomment the @ts-expect-error line and see what happens when
    //       a variant is missing from the switch.
    function summarize(item: CatalogItem): string {
      switch (item.kind) {
        case 'application':
          return item.name;
        case 'library':
          return item.name;
        case 'service':
          return item.name;
      }
    }

    expect(
      summarize({ kind: 'application', name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 }),
    ).toBe('Editor Pro');
  });

  // Going deeper:
  //   Discriminated unions are the TypeScript way to model state that can be in
  //   one of several *shapes*, not just one of several *values*. You will see
  //   them again on Day 2 when we model asynchronous state as
  //     { status: 'loading' } | { status: 'loaded'; data: T } | { status: 'error'; message: string }
  //   Ask your AI: "Compare discriminated unions in TypeScript to sealed classes
  //   in Java or C# records with pattern matching. What do they share, and
  //   where does TypeScript's structural approach differ?"
});

describe('type vs interface — two ways to name a shape', () => {
  it('both can describe an object', () => {
    type CatalogEntryT = { name: string; vendor: string };
    interface CatalogEntryI {
      name: string;
      vendor: string;
    }

    const a: CatalogEntryT = { name: 'Editor Pro', vendor: 'Acme' };
    const b: CatalogEntryI = { name: 'Editor Pro', vendor: 'Acme' };
    expect(a).toEqual(b);
  });

  // We use `type` throughout this course. Both work; both are valid in a
  // real codebase. `type` handles unions, intersections, and more advanced
  // compositions cleanly, which matters for the later files in this course.
  // If you're coming from C#, resist the urge to create an `IThing` for every
  // `Thing`: in TypeScript, types describe shapes, not contracts-for-classes,
  // and the prefix rarely earns its keep.
});
