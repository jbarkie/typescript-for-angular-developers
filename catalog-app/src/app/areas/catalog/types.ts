// The shape of the software catalog.
//
// Students saw this discriminated union in koan 04 (defining types) and koan 05
// (narrowing). It's the backbone of the whole app: the catalog is a list of
// items, each item is one of three kinds, and the `kind` field narrows to the
// specific variant.

export type ApplicationEntry = {
  kind: 'application';
  id: string;
  name: string;
  vendor: string;
  licenseCount: number;
};

export type LibraryEntry = {
  kind: 'library';
  id: string;
  name: string;
  version: string;
  license: 'MIT' | 'Apache-2.0' | 'proprietary';
};

export type ServiceEntry = {
  kind: 'service';
  id: string;
  name: string;
  url: string;
  monthlyCost: number;
};

export type CatalogItem = ApplicationEntry | LibraryEntry | ServiceEntry;

// Derived types — this is where koan 06 (utility types) pays rent in real code.
//
// The `kind` and `id` are assigned server-side; the client sends the rest.
// Deriving the payload shape from the full type means: when CatalogItem grows
// a field, this grows with it, and the compiler tells us everywhere to update.
//
// TODO(day-2-pm-derived-types): students derive the `Create*` types from the
// full entry types using `Omit`. One per variant, or a generic derivation —
// their call, with discussion.

export type CreateApplication = Omit<ApplicationEntry, 'kind' | 'id'>;
export type CreateLibrary = Omit<LibraryEntry, 'kind' | 'id'>;
export type CreateService = Omit<ServiceEntry, 'kind' | 'id'>;

export type CreateCatalogItem =
  | ({ kind: 'application' } & CreateApplication)
  | ({ kind: 'library' } & CreateLibrary)
  | ({ kind: 'service' } & CreateService);
