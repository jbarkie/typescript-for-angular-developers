import { describe, it, expect } from 'vitest';

// 06 — Utility Types
//
// So far, every type you've written has been a *source* type — defined from scratch.
// Utility types let you *derive* new types from the ones you already have. Rename
// them, transform them, compose them. Your types become a small language.
//
// The payoff: change one source type, and every derived type updates with it.
// The type system stops being a place where you repeat yourself.

type Application = {
  kind: 'application';
  name: string;
  vendor: string;
  licenseCount: number;
};

describe('keyof — the keys of a type as a union', () => {
  it('keyof produces a union of property names as string literals', () => {
    // TODO: derive a type `ApplicationKey` as `keyof Application`.
    //       It should be the union 'kind' | 'name' | 'vendor' | 'licenseCount'.
    type ApplicationKey = string; // fix this

    const k1: ApplicationKey = 'name';
    const k2: ApplicationKey = 'vendor';
    // @ts-expect-error — 'nickname' is not a key of Application
    const k3: ApplicationKey = 'nickname';

    expect([k1, k2]).toEqual(['name', 'vendor']);
  });
});

describe('typeof (in a type context) — the type of a value', () => {
  // Heads up: `typeof` has two jobs in TypeScript.
  //
  //   Runtime: `if (typeof x === 'string') { ... }` — a JS operator that returns
  //            one of a small set of strings at runtime.
  //
  //   Type:    `type T = typeof x;` — a TS-only operator that returns the type
  //            the compiler has inferred for the value `x`.
  //
  // Same keyword, different context, different meaning.

  it('typeof derives a type from an existing value', () => {
    const defaultApp = {
      kind: 'application' as const,
      name: '',
      vendor: '',
      licenseCount: 0,
    };

    // TODO: derive `DefaultApp` as `typeof defaultApp`.
    type DefaultApp = unknown; // fix this

    const fresh: DefaultApp = { ...defaultApp, name: 'Editor Pro' };
    expect(fresh.name).toBe('Editor Pro');
    expect(fresh.kind).toBe('application');
  });
});

describe('Pick<T, K> — carve out a subset', () => {
  it('Pick takes a type and a union of keys, returns a type with only those keys', () => {
    // TODO: define `ApplicationSummary` as a Pick of just 'name' and 'vendor' from Application.
    type ApplicationSummary = Application; // fix this

    const summary: ApplicationSummary = { name: 'Editor Pro', vendor: 'Acme' };
    expect(summary.name).toBe('Editor Pro');

    // @ts-expect-error — `licenseCount` is not part of the Summary shape
    const tooMuch: ApplicationSummary = { name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 };
  });
});

describe('Omit<T, K> — carve out everything but', () => {
  it("Omit is Pick's opposite — same list of keys, returns what's left", () => {
    // A real-world pattern: the server assigns the discriminant `kind` and an `id`.
    // The client sends everything else. We derive the payload shape from the full type.
    //
    // TODO: define `CreateApplication` as `Omit<Application, 'kind'>`.
    type CreateApplication = Application; // fix this

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
  it('Partial<T> makes every property optional', () => {
    // A PATCH-style update: any subset of fields may change.
    //
    // TODO: define `ApplicationPatch` as `Partial<Omit<Application, 'kind'>>`.
    //       (We Omit 'kind' first because the discriminant never changes.)
    type ApplicationPatch = Application; // fix this

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

    // TODO: define `WithRequiredEmail` as `Required<WithOptionalEmail>`.
    type WithRequiredEmail = WithOptionalEmail; // fix this

    const contact: WithRequiredEmail = { name: 'Ada', email: 'ada@example.com' };
    // @ts-expect-error — email is now required
    const missing: WithRequiredEmail = { name: 'Ada' };

    expect(contact.email).toBe('ada@example.com');
  });
});

describe('Readonly<T> — lock the shape', () => {
  it('Readonly<T> marks every property as readonly', () => {
    // TODO: define `FrozenApplication` as `Readonly<Application>`.
    type FrozenApplication = Application; // fix this

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
  it('Record<K, V> builds an object type from a union of keys and a value type', () => {
    type Status = 'approved' | 'under-review' | 'deprecated';

    // TODO: define `StatusCounts` as `Record<Status, number>`.
    //       Every status gets a required number.
    type StatusCounts = unknown; // fix this

    const counts: StatusCounts = {
      approved: 12,
      'under-review': 3,
      deprecated: 1,
    };
    expect(counts.approved).toBe(12);
  });
});

describe('NonNullable<T> — strip null and undefined', () => {
  it('NonNullable removes null and undefined from a type', () => {
    type MaybeName = string | null | undefined;

    // TODO: define `DefinitelyName` as `NonNullable<MaybeName>`.
    type DefinitelyName = MaybeName; // fix this

    const name: DefinitelyName = 'Ada';
    // @ts-expect-error — DefinitelyName does not allow null
    const nope: DefinitelyName = null;

    expect(name).toBe('Ada');
  });
});

describe('ReturnType<T> — derive from function shapes', () => {
  it('ReturnType extracts the return type of a function', () => {
    function createApplication(name: string, vendor: string) {
      return {
        kind: 'application' as const,
        name,
        vendor,
        licenseCount: 0,
      };
    }

    // TODO: define `NewApp` as `ReturnType<typeof createApplication>`.
    type NewApp = unknown; // fix this

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
