import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService)
  sidebarOpen: WritableSignal<boolean> = signal(false);


  logout(): void {
    this.authService.userName.set('');
    this.authService.isLogin.set(false);
    this.authService.logOut();
    localStorage.removeItem('role')
  }
}
