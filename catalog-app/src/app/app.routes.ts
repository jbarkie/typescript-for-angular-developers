import type { Routes } from '@angular/router';
import { NAV_SECTIONS } from './shared/nav-config';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'catalog',
    loadChildren: () => import('./areas/catalog/catalog.routes').then((m) => m.catalogRoutes),
  },
  {
    path: 'books',
    loadChildren: () => import('./areas/books/books-routes').then(m => m.booksRoutes)
  },
  { path: '**', redirectTo: 'catalog' },
];

// Re-export for the nav so it doesn't need to import from shared directly.
export { NAV_SECTIONS };
