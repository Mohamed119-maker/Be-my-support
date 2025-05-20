import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar/sidebar.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, NgxSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
}
