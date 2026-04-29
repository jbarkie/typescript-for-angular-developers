

import { Routes } from '@angular/router';
import { Books } from './books';
import { List } from './pages/list';
import { Add } from './pages/add';
import { booksStore } from './stores/books-store';
export const booksRoutes:Routes = [
    {
        path: '',
        providers: [booksStore],
        component: Books,
        children: [
            {
                path: 'list',
                component: List
            },
            {
                path: 'add',
                component: Add
            }
        ]
    }
]