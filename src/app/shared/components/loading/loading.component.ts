import { Component } from '@angular/core';

@Component({
    selector: 'app-loading',
    standalone: true,
    template: `
    <div class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0E7490] mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  `
})
export class LoadingComponent { } 