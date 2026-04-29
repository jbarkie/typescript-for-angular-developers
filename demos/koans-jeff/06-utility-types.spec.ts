import { describe, it, expect } from 'vitest';

// INSTRUCTOR COPY — 06 Utility Types
//
// Solutions inline. Student-facing TODOs preserved as STUDENT comments so you
// can see at a glance what they were asked to do.
//
// Full demo choreography and "watch out for" notes:
//   instructor-guide/koans-lead-ins.md § 06
//
// ARC NOTE: `Omit<Application, 'kind'>` is the Day 2 PM seed. When you teach
// it, say "remember this — it's how we'll shape API payloads tomorrow."
//
// NEXT-TIME NOTES (scratchpad for during/after class — fold in next revision):
// -
// -
// -

type Application = {
  kind: 'application';
  name: string;
  vendor: string;
  licenseCount: number;
};

describe('keyof — the keys of a type as a union', () => {
  // INSTRUCTOR: `keyof` is the first of two meta-operators in this file.
  // Together with `typeof` (type context), it's the bedrock most utility
  // types stand on. Show the hover: `ApplicationKey` is `'kind' | 'name' | ...`.

  it('keyof produces a union of property names as string literals', () => {
    // STUDENT: derive a type `ApplicationKey` as `keyof Application`.
    //          It should be the union 'kind' | 'name' | 'vendor' | 'licenseCount'.
    type ApplicationKey = keyof Application;

    const k1: ApplicationKey = 'name';
    const k2: ApplicationKey = 'vendor';
    // @ts-expect-error — 'nickname' is not a key of Application
    const k3: ApplicationKey = 'nickname';

    expect([k1, k2]).toEqual(['name', 'vendor']);
  });
});

describe('typeof (in a type context) — the type of a value', () => {
  // INSTRUCTOR: THIS IS THE PLACE to explicitly distinguish the two `typeof`s.
  // Runtime `typeof x === 'string'` vs. type-context `type T = typeof x`.
  // Same keyword, different jobs. One-time mental calibration — name it once
  // and move on. Confusion here causes cascading problems in file 07.

  it('typeof derives a type from an existing value', () => {
    const defaultApp = {
      kind: 'application' as const,
      name: '',
      vendor: '',
      licenseCount: 0,
    };

    // STUDENT: derive `DefaultApp` as `typeof defaultApp`.
    type DefaultApp = typeof defaultApp;

    const fresh: DefaultApp = { ...defaultApp, name: 'Editor Pro' };
    expect(fresh.name).toBe('Editor Pro');
    expect(fresh.kind).toBe('application');
  });
});

describe('Pick<T, K> — carve out a subset', () => {
  // INSTRUCTOR: First of the trinity (Pick / Omit / Partial). Pick is "give
  // me these fields." Frame it positively — a summary shape derived from the
  // full shape, rather than a new shape defined from scratch.

  it('Pick takes a type and a union of keys, returns a type with only those keys', () => {
    // STUDENT: define `ApplicationSummary` as a Pick of just 'name' and 'vendor' from Application.
    type ApplicationSummary = Pick<Application, 'name' | 'vendor'>;

    const summary: ApplicationSummary = { name: 'Editor Pro', vendor: 'Acme' };
    expect(summary.name).toBe('Editor Pro');

    // @ts-expect-error — `licenseCount` is not part of the Summary shape
    const tooMuch: ApplicationSummary = { name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 };
  });
});

describe('Omit<T, K> — carve out everything but', () => {
  // INSTRUCTOR: The Day-2-PM bridge. Say out loud: "this is the pattern for
  // API-payload types derived from domain types. When the domain type grows
  // a field, this derived type grows with it — the compiler will tell us
  // everywhere to update."

  it("Omit is Pick's opposite — same list of keys, returns what's left", () => {
    // A real-world pattern: the server assigns the discriminant `kind` and an `id`.
    // The client sends everything else. We derive the payload shape from the full type.
    //
    // STUDENT: define `CreateApplication` as `Omit<Application, 'kind'>`.
    type CreateApplication = Omit<Application, 'kind'>;

    const payload: CreateApplication = {
      name: 'Editor Pro',
      vendor: 'Acme',
      licenseCount: 50,
    };
    expect(payload.name).toBe('Editor Pro');
  });

  // This pattern — derive the API-payload type from the domain type — will
  // show up again on Day 2 when we wire a form to send new catalog items.
  // Worth remembering.
});

describe('Partial<T> and Required<T> — toggle optionality', () => {
  // INSTRUCTOR: Partial as the "PATCH payload" mental model. Required as the
  // rarely-needed inverse. One test each; keep moving.

  it('Partial<T> makes every property optional', () => {
    // A PATCH-style update: any subset of fields may change.
    //
    // STUDENT: define `ApplicationPatch` as `Partial<Omit<Application, 'kind'>>`.
    //          (We Omit 'kind' first because the discriminant never changes.)
    type ApplicationPatch = Partial<Omit<Application, 'kind'>>;

    const patch1: ApplicationPatch = { name: 'Editor Pro v2' };
    const patch2: ApplicationPatch = {};
    const patch3: ApplicationPatch = { vendor: 'Acme', licenseCount: 100 };

    expect(patch1.name).toBe('Editor Pro v2');
    expect(patch2).toEqual({});
    expect(patch3.vendor).toBe('Acme');
  });

  it('Required<T> is the inverse — every optional property becomes required', () => {
    type WithOptionalEmail = {
      name: string;
      email?: string;
    };

    // STUDENT: define `WithRequiredEmail` as `Required<WithOptionalEmail>`.
    type WithRequiredEmail = Required<WithOptionalEmail>;

    const contact: WithRequiredEmail = { name: 'Ada', email: 'ada@example.com' };
    // @ts-expect-error — email is now required
    const missing: WithRequiredEmail = { name: 'Ada' };

    expect(contact.email).toBe('ada@example.com');
  });
});

describe('Readonly<T> — lock the shape', () => {
  // INSTRUCTOR: Note — `Readonly<T>` is a compile-time-only check. At runtime
  // JavaScript has no concept of readonly (no Object.freeze without calling it
  // explicitly). So the assignment below would run at runtime if the student
  // tried it — hence the "uncomment to see" pattern rather than @ts-expect-error
  // on a line that'd mutate the object. This is another Day-3 theme preview.

  it('Readonly<T> marks every property as readonly', () => {
    // STUDENT: define `FrozenApplication` as `Readonly<Application>`.
    type FrozenApplication = Readonly<Application>;

    const frozen: FrozenApplication = {
      kind: 'application',
      name: 'Editor Pro',
      vendor: 'Acme',
      licenseCount: 50,
    };
    // Uncomment the next line. TypeScript will refuse — every property is readonly.
    // (At runtime, JavaScript would let the mutation through. Readonly is compile-time only.)
    //
    // frozen.vendor = 'Different';

    expect(frozen.vendor).toBe('Acme');
  });

  // Going deeper:
  //   `Readonly<T>` is shallow. A readonly property can still hold a mutable
  //   object. `ReadonlyArray<T>` and `readonly T[]` exist for collections.
  //   Ask your AI: "give me a case where Readonly<T> looks like it protects a
  //   value, but a mutation still slips through. What's the deep-readonly
  //   approach people actually use?"
});

describe('Record<K, V> — the dictionary shape', () => {
  // INSTRUCTOR: Underdeliver on this one if time is short. The key idea: `Record`
  // builds an object type from a union of keys and a value type. Common real
  // use: counts-by-status, i18n-by-locale, config-by-env.

  it('Record<K, V> builds an object type from a union of keys and a value type', () => {
    type Status = 'approved' | 'under-review' | 'deprecated';

    // STUDENT: define `StatusCounts` as `Record<Status, number>`.
    //          Every status gets a required number.
    type StatusCounts = Record<Status, number>;

    const counts: StatusCounts = {
      approved: 12,
      'under-review': 3,
      deprecated: 1,
    };
    expect(counts.approved).toBe(12);
  });
});

describe('NonNullable<T> — strip null and undefined', () => {
  // INSTRUCTOR: Small, useful, briefly. Worth knowing, not worth dwelling on.

  it('NonNullable removes null and undefined from a type', () => {
    type MaybeName = string | null | undefined;

    // STUDENT: define `DefinitelyName` as `NonNullable<MaybeName>`.
    type DefinitelyName = NonNullable<MaybeName>;

    const name: DefinitelyName = 'Ada';
    // @ts-expect-error — DefinitelyName does not allow null
    const nope: DefinitelyName = null;

    expect(name).toBe('Ada');
  });
});

describe('ReturnType<T> — derive from function shapes', () => {
  // INSTRUCTOR: The `typeof` nested inside is mandatory — ReturnType takes a
  // TYPE, not a value. Most students forget this on first try; that's fine,
  // the compiler error is clear and the fix is memorable.

  it('ReturnType extracts the return type of a function', () => {
    function createApplication(name: string, vendor: string) {
      return {
        kind: 'application' as const,
        name,
        vendor,
        licenseCount: 0,
      };
    }

    // STUDENT: define `NewApp` as `ReturnType<typeof createApplication>`.
    type NewApp = ReturnType<typeof createApplication>;

    const fresh: NewApp = {
      kind: 'application',
      name: 'Editor Pro',
      vendor: 'Acme',
      licenseCount: 0,
    };
    expect(fresh.name).toBe('Editor Pro');
  });

  // Going deeper:
  //   `Parameters<T>` is the sibling utility — it gives you a tuple of the
  //   parameter types. Useful when you want to wrap a function without
  //   hand-copying its signature.
  //   Ask your AI: "show me a logging wrapper that accepts any function and
  //   preserves its parameter and return types using Parameters and ReturnType."
});

// Going deeper (file-level):
//
// Utility types are not magic — they are written in TypeScript, in terms of the
// language's own mapped-type and conditional-type features. The implementation
// of `Pick<T, K>` is roughly `{ [P in K]: T[P] }`. Short, readable, surprising.
//
// If you want to peek under the hood, open your editor and go-to-definition on
// `Pick`, or `Partial`, or `Record`. You'll see a few lines of TypeScript. That's
// all there is.
//
// Ask your AI: "walk me through the implementation of Omit<T, K> from the TypeScript
// standard library. What does each piece do, and why does it need `keyof any`?"
