import { setupWorker } from 'msw/browser';
import booksHandlers from './books/handlers';
import catalogHandlers from './catalog/handlers';

export const worker = setupWorker(...catalogHandlers, ...booksHandlers);
