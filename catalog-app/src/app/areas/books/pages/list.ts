import { Component, inject } from '@angular/core';
import { booksStore } from '../stores/books-store';

@Component({
  selector: 'app-books-list',
  imports: [],
  template: `
        <p>Book List Here</p>

        @if(store.hasError()) {
            <div class="alert alert-error">
                {{store.errorMessage()}}
        </div>


        } @else {
    <ul>
        @for(book of store.entities(); track book.id) {
            
            <li>{{ book.title }} by {{ book.author}} released in {{ book.yearReleased }}</li>
        } @empty {
            <p>Hold tight, loading your books or something...</p>
        }
        
        </ul>
    }
    `,
  styles: ``,
})
export class List {
  store = inject(booksStore);
}
