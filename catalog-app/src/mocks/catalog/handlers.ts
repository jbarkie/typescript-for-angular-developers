import { delay, http, HttpHandler, HttpResponse } from 'msw';
import activeScenarios from '../active-scenarios';
import type { CatalogItem } from '../../app/areas/catalog/types';

const GET_ENDPOINT = '/api/catalog';
const POST_ENDPOINT = '/api/catalog';

// The seed set. Deliberately tiny so the UI stays readable on a projector.
const items: CatalogItem[] = [
  { kind: 'application', id: 'app-1', name: 'Editor Pro', vendor: 'Acme', licenseCount: 50 },
  { kind: 'application', id: 'app-2', name: 'Design Studio', vendor: 'Figura', licenseCount: 20 },
  { kind: 'library', id: 'lib-1', name: 'date-fns', version: '3.6.0', license: 'MIT' },
  { kind: 'library', id: 'lib-2', name: 'zod', version: '4.3.6', license: 'MIT' },
  { kind: 'service', id: 'svc-1', name: 'Notifier', url: 'https://ntfy.sh', monthlyCost: 12 },
  {
    kind: 'service',
    id: 'svc-2',
    name: 'Error Tracker',
    url: 'https://sentry.io',
    monthlyCost: 29,
  },
];

// The malformed-data scenario's response.
// Well-shaped-looking, but with wrong types: `licenseCount` is a string, the
// library entry is missing `license`. TypeScript can't see this happening at
// the boundary — the handler casts and ships. Zod, on Day 3, catches it.
const malformedItems = [
  { kind: 'application', id: 'app-1', name: 'Editor Pro', vendor: 'Acme', licenseCount: 'fifty' },
  { kind: 'library', id: 'lib-1', name: 'date-fns', version: '3.6.0' },
];

export default [
  http.get(GET_ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${GET_ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        await delay(250);
        return HttpResponse.json([]);

      case 'server-error':
        await delay(250);
        return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });

      case 'slow':
        await delay(3000);
        return HttpResponse.json(items);

      case 'malformed-data':
        await delay(250);
        return HttpResponse.json(malformedItems);

      case 'typical':
      default:
        await delay(250);
        return HttpResponse.json(items);
    }
  }),

  http.post(POST_ENDPOINT, async ({ request }) => {
    const scenario = activeScenarios[`POST ${POST_ENDPOINT}`] ?? 'created';

    switch (scenario) {
      case 'validation-error':
        await delay(250);
        return HttpResponse.json(
          {
            message: 'Validation failed',
            fields: {
              name: 'Name must be at least 3 characters',
              vendor: 'Vendor is required',
            },
          },
          { status: 400 },
        );

      case 'server-error':
        await delay(250);
        return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });

      case 'slow': {
        await delay(2000);
        const payload = (await request.json()) as CatalogItem;
        const withId: CatalogItem = { ...payload, id: `${payload.kind}-${items.length + 1}` };
        items.push(withId);
        return HttpResponse.json(withId, { status: 201 });
      }

      case 'created':
      default: {
        await delay(250);
        const payload = (await request.json()) as CatalogItem;
        const withId: CatalogItem = { ...payload, id: `${payload.kind}-${items.length + 1}` };
        items.push(withId);
        return HttpResponse.json(withId, { status: 201 });
      }
    }
  }),
] as HttpHandler[];
