import { delay, http, HttpHandler, HttpResponse } from 'msw';
import activeScenarios from '../active-scenarios';
import { BookApiItem } from '../../app/areas/books/types/schemas';


const ENDPOINT = 'https://some-api.someserver.com';

const typicalResponse: BookApiItem[] = [
  {
    id: 'book-1',
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    yearReleased: 2003,
  },
  {
    id: 'book-2',
    title: 'Refactoring',
    author: 'Martin Fowler',
    yearReleased: 2018,
  },
  {
    id: 'book-3',
    title: 'A Philosophy of Software Design',
    author: 'John Ousterhout',
    yearReleased: 2018,
  },
];

const overloadedResponse: BookApiItem[] = Array.from({ length: 24 }, (_, index) => ({
  id: `book-${index + 1}`,
  title: `Book ${index + 1}`,
  author: `Author ${index + 1}`,
  yearReleased: 2000 + (index % 20),
}));

const malformedResponse = [
  {
    id: 'book-1',
    title: 'Looks Fine At First',
    author: null,
    yearReleased: '2003',
  },
  {
    id: null,
    title: 'Missing Identifier',
    author: 'Unknown',
    yearReleased: 1999,
  },
];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'overloaded':
        return HttpResponse.json(overloadedResponse);
      case 'unauthorized':
        return new HttpResponse(null, { status: 401 });
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'slow':
        await delay(4000);
        return HttpResponse.json(typicalResponse);
      case 'timeout':
        await delay('infinite');
        return HttpResponse.json(typicalResponse);
      case 'malformed-data':
        return HttpResponse.json(malformedResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
