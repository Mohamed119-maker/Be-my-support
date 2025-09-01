import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    TableModule
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss'
})
export class DashboardOverviewComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly id = inject(PLATFORM_ID);
  usersNum: WritableSignal<number> = signal(0);
  productsNum: WritableSignal<number> = signal(0);
  categoriesNum: WritableSignal<number> = signal(0);
  isLoading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  // Chart Data
  userGrowthData: WritableSignal<any> = signal({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'New Users',
        data: [28, 48, 40, 65, 59, 80],
        fill: true,
        borderColor: '#4CAF50',
        tension: 0.4,
        backgroundColor: 'rgba(76, 175, 80, 0.2)'
      }
    ]
  });

  productTrendsData: WritableSignal<any> = signal({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Products Added',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        borderWidth: 1
      }
    ]
  });

  // Chart Options
  chartOptions: WritableSignal<any> = signal({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  });

  // Recent Activity
  recentActivity: WritableSignal<any[]> = signal([
    { type: 'New User', description: 'John Doe joined the platform', time: '2 minutes ago' },
    { type: 'New Product', description: 'New product added: Gaming Laptop', time: '1 hour ago' },
    { type: 'Category Update', description: 'Electronics category updated', time: '3 hours ago' },
    { type: 'User Activity', description: 'Sarah posted a new review', time: '5 hours ago' }
  ]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getUsersNum();
      this.getProductsNum();
      this.getCategoriesNum();
    }
  }

  animateCount(current: WritableSignal<number>, target: number) {
    const duration = 2000;
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

  getGrowthPercentage(current: number, previous: number): number {
    return previous ? ((current - previous) / previous) * 100 : 100;
  }

  retryLoad(): void {
    this.getUsersNum();
    this.getProductsNum();
    this.getCategoriesNum();
  }
}
