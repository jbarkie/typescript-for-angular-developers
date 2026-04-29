import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-books-home',
  imports: [RouterOutlet, RouterLink],
  template: `
    <section class="container mx-auto">
      <h1>Books!</h1>
      <div class="flex flex-row gap-4">
        <a routerLink="list">List</a>
        <a routerLink="add">Add</a>
      </div>
      <div>
        <router-outlet />
      </div>
    </section>
  `,
  styles: ``,
})
export class Books {}
