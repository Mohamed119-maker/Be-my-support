
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Be_my_support';

  constructor(private flowbiteService: FlowbiteService) { }

  sidebarOpen: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
