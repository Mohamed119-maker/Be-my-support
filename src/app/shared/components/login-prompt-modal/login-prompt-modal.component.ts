import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login-prompt-modal',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Login Required</h2>
        <p class="text-gray-600 mb-6">You must be logged in to use this feature. Please log in to continue.</p>
        <div class="flex justify-end gap-4">
          <button 
            (click)="onClose.emit()"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <a 
            routerLink="/login"
            class="px-4 py-2 bg-main-color text-white rounded hover:bg-opacity-90 transition-colors">
            Log In
          </a>
        </div>
      </div>
    </div>
  `
})
export class LoginPromptModalComponent {
    @Output() onClose = new EventEmitter<void>();
} 