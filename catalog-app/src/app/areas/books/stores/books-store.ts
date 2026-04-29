import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { BookApiItem, BookApiItemsSchema } from '../types/schemas';
import { z } from 'zod';

const URI = 'https://jsonplaceholder.typicode.com/todos';
const REALISH_URI = 'https://some-api.someserver.com';
export const booksStore = signalStore(
  withState({
    hasError: false,
    errorMessage: undefined as string | undefined,
  }),
  withEntities<BookApiItem>(),

  withMethods((state) => ({
    _load: async () => {
      return fetch(REALISH_URI)
        .then((r) => r.json() as unknown as BookApiItem[])
        .then((books) => BookApiItemsSchema.safeParse(books))
        .then((result) => {
            if(result.success) {
                patchState(state, setEntities(result.data))
            } else {
                patchState(state, { hasError: true, errorMessage: 'Bad data returned form API'});
                
            }
        });
    },
  })),
  withHooks({
    async onInit(store) {
      await store._load();
    },
  }),
);
