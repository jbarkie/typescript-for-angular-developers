import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import type { CatalogItem, CreateCatalogItem } from './types';

// The add page. Deliberately naive at this stage.
//
// TODO(day-3-pm-form): rewrite with signal forms (@angular/forms/signals).
//   Use `form()` with a model signal holding CreateCatalogItem.
//   Wire validators per-field. The submit handler posts to /api/catalog.
//
// TODO(day-3-pm-zod): validate the form value against a Zod schema before
//   posting. The schema and the TS type should be derived from one another —
//   z.infer<typeof schema> === CreateCatalogItem. Demonstrate that the
//   compile-time type and the runtime validation are two views of the same
//   thing.
//
// For now, this is a plain signal holding an application-shaped payload, a
// plain <input>-bound template, and a submit button that posts directly. No
// validation. No narrowing. No error states. It works — but it's the "before"
// picture.

@Component({
  selector: 'app-catalog-add',
  template: `
    <div class="container mx-auto p-6 max-w-xl">
      <h1 class="text-2xl font-bold mb-4">Add Software</h1>

      <form (submit)="submit($event)" class="flex flex-col gap-4">
        <label class="floating-label">
          <span>Name</span>
          <input
            class="input input-bordered w-full"
            [value]="name()"
            (input)="name.set(inputValue($event))"
          />
        </label>

        <label class="floating-label">
          <span>Vendor</span>
          <input
            class="input input-bordered w-full"
            [value]="vendor()"
            (input)="vendor.set(inputValue($event))"
          />
        </label>

        <label class="floating-label">
          <span>License count</span>
          <input
            type="number"
            class="input input-bordered w-full"
            [value]="licenseCount()"
            (input)="licenseCount.set(Number(inputValue($event)))"
          />
        </label>

        <div class="flex gap-2">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-ghost" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
})
export class CatalogAdd {
  #http = inject(HttpClient);
  #router = inject(Router);

  // Only the 'application' variant is handled in the naive version.
  // The form-refactor on day 3 generalizes this.
  name = signal('');
  vendor = signal('');
  licenseCount = signal(0);

  Number = Number;

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    const payload: CreateCatalogItem = {
      kind: 'application',
      name: this.name(),
      vendor: this.vendor(),
      licenseCount: this.licenseCount(),
    };
    this.#http.post<CatalogItem>('/api/catalog', payload).subscribe(() => {
      this.#router.navigate(['/catalog']);
    });
  }

  cancel(): void {
    this.#router.navigate(['/catalog']);
  }
}
