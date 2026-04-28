import type { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list').then((m) => m.CatalogList),
  },
  {
    path: 'add',
    loadComponent: () => import('./add').then((m) => m.CatalogAdd),
  },
];
