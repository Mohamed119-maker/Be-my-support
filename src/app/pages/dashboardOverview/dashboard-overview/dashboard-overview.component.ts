import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-overview',
  imports: [],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss'
})
export class DashboardOverviewComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly id = inject(PLATFORM_ID);
  usersNum: WritableSignal<number> = signal(0);
  productsNum: WritableSignal<number> = signal(0);
  categoriesNum: WritableSignal<number> = signal(0);
  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getUsersNum();
      this.getProductsNum();
      this.getCategoriesNum();
    }

  }
  animateCount(current: WritableSignal<number>, target: number) {
    const duration = 2000; // المدة الإجمالية
    const steps = 60;
    const stepTime = duration / steps;
    const increment = Math.ceil(target / steps);

    let value = 0;
    const interval = setInterval(() => {
      value += increment;
      if (value >= target) {
        current.set(target);
        clearInterval(interval);
      } else {
        current.set(value);
      }
    }, stepTime);
  }

  getUsersNum(): void {
    this.dashboardService.getAllUsers().subscribe({
      next: (res) => {
        const total = res.data.length;
        this.animateCount(this.usersNum, total);
      }
    });
  }

  getProductsNum(): void {
    this.dashboardService.getAllProducts().subscribe({
      next: (res) => {
        const total = res.Products.length;
        this.animateCount(this.productsNum, total);
      }
    });
  }

  getCategoriesNum(): void {
    this.dashboardService.getAllCategories().subscribe({
      next: (res) => {
        const total = res.data.length;
        this.animateCount(this.categoriesNum, total);
      }
    });
  }


}
