# msw-lens context
generated: 2026-04-29T19:25:07.062Z
entry: src\app\areas\books\pages\list.ts

---

## The ask

I'm working on the `List` component in a web application and want to
create MSW mock scenarios for the endpoints it depends on.

Based on the source files below, please:

1. Identify the HTTP endpoints this component reaches — through its hooks, stores, services, or direct fetch/http calls
2. For each endpoint, generate a `.yaml` manifest in msw-lens format
3. For each endpoint, also generate a handler stub (`.ts`) with a switch statement
   over the scenario names — match the pattern in the existing handler files
4. Register the new handler in `handlers.ts` — match the existing import pattern
5. For each scenario, cover: happy path, empty/null states, error conditions
   (with appropriate HTTP status codes), slow/timeout, and any edge cases the
   **response type shape** suggests I haven't anticipated

**On scenario descriptions:** say what UI behavior it tests, not what the data
looks like. Not: "Returns an empty items array." Instead: "Tests that the empty
cart message appears and the checkout button disables."

Use the format and vocabulary from the existing manifests below. If you notice
anything in the component or its markup that suggests a scenario I should
consider but haven't asked about — flag it.

If the provided files are incomplete — init methods with no visible call site,
protected routes with no guard in scope, dependencies that seem to come from
outside what was crawled — **list your assumptions explicitly** rather than
silently filling the gaps.

---

## Source files

### list.ts
`src\app\areas\books\pages\list.ts`
```typescript
import { Component, inject } from '@angular/core';
import { booksStore } from '../stores/books-store';

@Component({
    selector: 'app-books-list',
    imports: [],
    template: `
        <p>Book List Here</p>
        <ul>
            @for (book of store.entities(); track book.id) {
                <li>{{book.title}} by {{book.author}}</li>
            }
        </ul>
    `,
    styles: ``
})
export class List {
    store = inject(booksStore);
}
```

### books-store.ts
`src\app\areas\books\stores\books-store.ts`
```typescript
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { BookApiItem } from '../types/book-types';

const URI = 'https://jsonplaceholder.typicode.com/todos'
const REALISH_URI = 'https://some-api.someserver.com'
export const booksStore = signalStore(
  withEntities<BookApiItem>(),

  withMethods((state) => ({
    _load: async () => {
      return fetch(URI).then(
        (r) => r.json() as unknown as BookApiItem[],
      ).then(books => patchState(state, setEntities(books)))
    },
  })),
  withHooks({
    async onInit(store) {
        await store._load();
    },
  })
);
```

### book-types.ts
`src\app\areas\books\types\book-types.ts`
```typescript
export type BookApiItem = {
    id: string;
    title: string;
    author: string;
    yearReleased: number
}
```

---

## Existing manifests + handlers (pattern reference)

### catalog.yaml
`src\mocks\catalog\catalog.yaml`
```yaml
# yaml-language-server: $schema=https://unpkg.com/@hypertheory-labs/msw-lens/schema/manifest.schema.json

endpoint: /api/catalog
method: GET
shape: collection
description: The company software catalog — list all approved applications, libraries, and services.

responseType:
  name: CatalogItem
  path: src/app/areas/catalog/types.ts

context:
  sourceHints:
    - src/app/areas/catalog/list.ts
  hints:
    - Each item is a discriminated union variant (application | library | service); the UI narrows on `item.kind`.
    - The malformed-data scenario is the Day 3 Zod-at-the-boundary demo — flip to it to show that TypeScript trusts the cast and Zod doesn't.

scenarios:
  typical:
    description: Six seeded items — two of each variant. Exercises the `@for` grid and the kind-narrowing branches.
    active: true

  empty:
    description: Zero items — exercises the `@empty` branch of the list template.

  server-error:
    description: 500 from the server — exercises the error branch of the discriminated-union list state.
    httpStatus: 500

  slow:
    description: Same as typical, but 3-second delay — lets the instructor linger on the loading branch.
    delay: 3000

  malformed-data:
    description: Well-shaped-looking response with wrong types — licenseCount as a string, missing fields. Compiles because handlers cast; breaks at the UI. The setup for the Zod reveal on Day 3.
```

### catalog-post.yaml
`src\mocks\catalog\catalog-post.yaml`
```yaml
# yaml-language-server: $schema=https://unpkg.com/@hypertheory-labs/msw-lens/schema/manifest.schema.json

endpoint: /api/catalog
method: POST
description: Add a new item to the software catalog. Payload is a CreateCatalogItem (kind + variant-specific fields).

responseType:
  name: CatalogItem
  path: src/app/areas/catalog/types.ts

errorType:
  name: ValidationError
  path: src/app/areas/catalog/types.ts

context:
  sourceHints:
    - src/app/areas/catalog/add.ts
  hints:
    - The form starts life as a plain signal-per-field and gets rewritten to a typed signal form + Zod on Day 3.
    - validation-error scenario is shaped to demo form-field-level error binding when the server returns 400.

scenarios:
  created:
    description: Happy path — returns the created item with a server-assigned id.
    active: true

  validation-error:
    description: 400 with field-level errors. Exercises the form's per-field error surface.
    httpStatus: 400

  server-error:
    description: 500. Exercises whatever the form does when the submit fails at a system level.
    httpStatus: 500

  slow:
    description: Same as created, but 2-second delay. Exercises the pending/disabled state of the submit button.
    delay: 2000
```

---

## About msw-lens

msw-lens manages MSW scenario switching for web development. Manifests live
alongside handlers under `src/mocks/`. The active scenario is written to
`src/mocks/active-scenarios.ts` — Vite HMR picks it up immediately.

`active-scenarios.ts` is tool-owned. Do not include instructions to edit it manually.

### Handler pattern (match this exactly)

Every handler follows the shape below. Three things are non-negotiable:

1. **Default-import** `activeScenarios` — the file uses `export default`, not a named export.
2. **Key lookup uses `` `METHOD ${ENDPOINT}` ``** — the switcher writes keys in that format. Missing the method prefix means the switcher has no effect and the handler silently falls through to the default case.
3. **Default-export the handler array** as `HttpHandler[]` — `handlers.ts` aggregates by importing each as a default and spreading.

```typescript
import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/cart';

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json({ items: [], total: 0 });
      case 'unauthorized':
        return new HttpResponse(null, { status: 401 });
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'slow':
        await delay('real');
        return HttpResponse.json(typicalResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
```

Register in `handlers.ts`:

```typescript
import { HttpHandler } from 'msw';
import cartHandler from './cart/cart';

export const handlers: HttpHandler[] = [
  ...cartHandler,
];
```

Scenario archetypes to consider:

**Document endpoints** (single item responses):
- `happy-path` — successful response with typical data
- `not-found` — 404, resource doesn't exist
- `unauthorized` — 401, tests auth guards and login redirect
- `server-error` — 500, tests error boundary or fallback UI
- `slow` — MSW delay('real'), tests loading/skeleton states
- `malformed-data` — response missing optional fields or with unexpected nulls

**Collection endpoints** (array/list responses):
- `typical` — N items, normal case
- `empty` — zero items, tests empty-state UI
- `overloaded` — far more items than the UI was designed for (tests pagination, overflow)
- `slow` — tests loading skeleton
- `unauthorized` — 401
- `server-error` — 500

**Mutation endpoints** (POST / PUT / PATCH / DELETE):
- `success` / `created` — 201/202/204, happy path; tests UI confirmation, redirect, or form reset
- `validation-error` — 400/422, field-level ProblemDetails; tests whether error messages surface per-field or as a summary
- `conflict` — 409, duplicate or constraint violation; tests whether the UI surfaces a meaningful message
- `unauthorized` — 401, session expired mid-form; tests redirect or inline session error
- `forbidden` — 403, insufficient role; tests whether the UI blocks submission or shows an access error
- `server-error` — 500; tests whether the form retains input and shows a recoverable error message
- `slow` — MSW delay('real'); tests whether the submit button shows a pending/disabled state during submission
