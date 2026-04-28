import { Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import type { CatalogItem } from './types';

// The list page. Deliberately naive at this stage.
//
// TODO(day-2-pm-discriminated-state): refactor to a discriminated-union state
//   type — { kind: 'loading' } | { kind: 'loaded'; items } | { kind: 'error'; message }.
//   The template becomes a @switch over state.kind, and every branch has the
//   fields it needs, no optional chaining required.
//
// Right now the template shows "loading..." with `@if (resource.isLoading())`,
// nothing for the error case, and just the list of items otherwise. That's
// reasonable but it fragments the state across three signals. The refactor
// shows what happens when we model it as one shape.

@Component({
  selector: 'app-catalog-list',
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Software Catalog</h1>

      @if (resource.isLoading()) {
        <div class="flex items-center gap-2">
          <span class="loading loading-spinner text-primary"></span>
          <span>Loading catalog…</span>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (item of resource.value(); track item.id) {
            <div class="card bg-base-100 shadow-sm border border-base-300">
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <h2 class="card-title">{{ item.name }}</h2>
                  <span class="badge badge-outline">{{ item.kind }}</span>
                </div>

                <!-- TODO(day-2-pm-narrowing): instead of optional chaining on every
                     variant's unique fields, replace this with a @switch on item.kind
                     and render each variant with its own template. Cleaner, type-safer. -->
                <p class="text-sm text-base-content/70">
                  @if (item.kind === 'application') {
                    {{ item.vendor }} — {{ item.licenseCount }} licenses
                  }
                  @if (item.kind === 'library') {
                    v{{ item.version }} — {{ item.license }}
                  }
                  @if (item.kind === 'service') {
                    {{ item.url }} — \${{ item.monthlyCost }}/mo
                  }
                </p>
              </div>
            </div>
          } @empty {
            <p class="text-base-content/70">No items in the catalog yet.</p>
          }
        </div>
      }
    </div>
  `,
})
export class CatalogList {
  resource = httpResource<CatalogItem[]>(() => '/api/catalog');
}
