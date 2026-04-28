// Navigation configuration.
//
// Notice the `as const satisfies` pattern — koan 07 made the case, this is a
// real-world application. We get:
//   - `NAV_SECTIONS` is deeply readonly
//   - `NAV_SECTIONS[0].path` is the literal '/catalog', not string
//   - if someone adds an entry missing a required field, the compiler complains
//   - the shape is type-checked against NavSection without widening
//
// This is the shape you want for team-wide config in a real codebase.

export type NavSection = {
  label: string;
  path: string;
};

export const NAV_SECTIONS = [
  { label: 'Catalog', path: '/catalog' },
  { label: 'Add', path: '/catalog/add' },
] as const satisfies readonly NavSection[];
