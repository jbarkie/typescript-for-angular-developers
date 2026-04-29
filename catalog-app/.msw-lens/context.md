# msw-lens — project context
generated: 2026-04-29T20:04:39.588Z

> Drop this file into any LLM conversation for instant context about what
> is mocked in this project, what scenarios exist, and what is currently active.

## Active scenarios

| endpoint | method | active scenario |
|----------|--------|-----------------|
| `/api/catalog` | GET | `typical` |
| `/api/catalog` | POST | `server-error` |
| `/api/books` | GET | `slow` |

## Scenario details

### GET `/api/catalog`
manifest: `src\mocks\catalog\catalog.yaml`
> The company software catalog — list all approved applications, libraries, and services.

- **typical** ✓ **(active)** — Six seeded items — two of each variant. Exercises the `@for` grid and the kind-narrowing branches.
- **empty** — Zero items — exercises the `@empty` branch of the list template.
- **server-error** *(500)* — 500 from the server — exercises the error branch of the discriminated-union list state.
- **slow** *(delay: 3000)* — Same as typical, but 3-second delay — lets the instructor linger on the loading branch.
- **malformed-data** — Well-shaped-looking response with wrong types — licenseCount as a string, missing fields. Compiles because handlers cast; breaks at the UI. The setup for the Zod reveal on Day 3.

sourceHints:
- `src/app/areas/catalog/list.ts`

### POST `/api/catalog`
manifest: `src\mocks\catalog\catalog-post.yaml`
> Add a new item to the software catalog. Payload is a CreateCatalogItem (kind + variant-specific fields).

- **created** — Happy path — returns the created item with a server-assigned id.
- **validation-error** *(400)* — 400 with field-level errors. Exercises the form's per-field error surface.
- **server-error** ✓ **(active)** *(500)* — 500. Exercises whatever the form does when the submit fails at a system level.
- **slow** *(delay: 2000)* — Same as created, but 2-second delay. Exercises the pending/disabled state of the submit button.

sourceHints:
- `src/app/areas/catalog/add.ts`

### GET `/api/books`
manifest: `src\mocks\books\books-get.yaml`
> Retrieve all books from the collection.

- **typical** — Twelve books returned — exercises the @for loop rendering each book's title and author.
- **empty** — Zero books — exercises the @empty branch of the list template, showing no items message.
- **server-error** *(500)* — 500 from the server — exercises the error handling in the store's _load method.
- **slow** ✓ **(active)** *(delay: 3000)* — Same as typical, but 3-second delay — lets the instructor linger on the loading state.
- **unauthorized** *(401)* — 401 from the server — tests that the UI handles auth errors gracefully.

sourceHints:
- `src/app/areas/books/pages/list.ts`
- `src/app/areas/books/stores/books-store.ts`

---

## How msw-lens works

msw-lens reads scenario manifests — YAML files co-located with MSW handlers under
`src/mocks/` — and writes the active selection to `src/mocks/active-scenarios.ts`.
Vite HMR picks up that file change immediately. No browser refresh needed.

`active-scenarios.ts` is **tool-owned**. Do not edit it manually; msw-lens regenerates it
on every run.

**Commands:**
- `npm run lens` — interactive scenario switcher (single run)
- `npm run lens:watch` — stay in the switcher, Ctrl+C to exit
- `npm run lens:context -- <component.ts>` — generate a prompt for an LLM

Manifests live alongside handlers: `auth/user.yaml` next to `auth/user.ts`.

---

## Manifest format

```yaml
endpoint: /api/resource/
method: GET
shape: document         # document | collection — determines scenario vocabulary
description: What this endpoint returns

responseType:
  name: TypeScriptTypeName
  path: relative/path/to/types.ts

context:
  sourceHints:          # paths to files that consume this endpoint
    - path/to/store.ts  # LLM reads these directly — provide pointers, not summaries
    - path/to/component.ts

scenarios:
  scenario-name:
    description: What UI behavior this tests (not just what the data looks like)
    active: true        # marks the default scenario
    httpStatus: 401     # optional — omit for 200
    delay: real    # optional — MSW delay mode
```
