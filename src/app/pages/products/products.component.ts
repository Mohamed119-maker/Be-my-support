import { ICategory } from '../../shared/interfaces/ICategory';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { Iproducts } from '../../shared/interfaces/iproducts';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { signal, WritableSignal, computed, Signal } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    SliderModule,
    ButtonModule,
    FormsModule,
    CardComponent,
    PaginatorModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly platformId = inject(PLATFORM_ID);

  // Make Math available to template
  protected readonly Math = Math;

  // Loading states
  isLoadingCategories: WritableSignal<boolean> = signal(true);
  isLoadingProducts: WritableSignal<boolean> = signal(true);

  // Data states
  selectedCat: WritableSignal<string> = signal('All Products');
  categories: WritableSignal<ICategory[]> = signal([]);
  products: WritableSignal<Iproducts[]> = signal([]);
  allProducts: WritableSignal<Iproducts[]> = signal([]); // Store all products
  wishlistItems: WritableSignal<Iproducts[]> = signal([]);

  // Pagination states
  first: WritableSignal<number> = signal(0);
  rows: WritableSignal<number> = signal(12);
  totalRecords: WritableSignal<number> = signal(0);
  categoryId?: string;

  // Computed pagination values
  currentPage: Signal<number> = computed(() =>
    Math.floor(this.first() / this.rows()) + 1
  );

  totalPages: Signal<number> = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / this.rows()))
  );

  isFirstPage: Signal<boolean> = computed(() =>
    this.currentPage() === 1
  );

  isLastPage: Signal<boolean> = computed(() =>
    this.currentPage() === this.totalPages()
  );

  // Maximum number of visible page numbers
  maxVisiblePages = 5;

  // Computed visible page numbers
  visiblePages: Signal<number[]> = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisiblePages;

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(current - Math.floor(max / 2), 1);
    let end = start + max - 1;

    if (end > total) {
      end = total;
      start = Math.max(end - max + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    } else if (isPlatformServer(this.platformId)) {
      // Set initial empty states for SSR
      this.isLoadingCategories.set(false);
      this.isLoadingProducts.set(false);
      this.categories.set([]);
      this.products.set([]);
      this.allProducts.set([]);
      this.wishlistItems.set([]);
    }
  }

  private loadInitialData(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllCategories();
      this.getAllProducts();
      this.getAllProductWishlist();
    }
  }

  getAllCategories(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoadingCategories.set(true);
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories.set([]);
      },
      complete: () => {
        this.isLoadingCategories.set(false);
      }
    });
  }

  getAllProducts(idCat?: string, page: number = 1): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Reset pagination when changing categories
    if (this.categoryId !== idCat) {
      this.first.set(0);
    }

    this.isLoadingProducts.set(true);
    this.categoryId = idCat;

    if (idCat) {
      this.selectedCat.set(this.categories().find(cat => cat._id === idCat)?.name || 'All Products');
    } else {
      this.selectedCat.set('All Products');
    }

    const size = this.rows();

    this.productsService.getAllProductsPagination(idCat, page, size).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalRecords.set(res.results);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.products.set([]);
        this.totalRecords.set(0);
        this.first.set(0);
      },
      complete: () => {
        this.isLoadingProducts.set(false);
      }
    });
  }

  getAllProductWishlist(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.data.wishlist);
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
        this.wishlistItems.set([]);
      }
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some(p => p._id === productId);
  }

  onPageChange(event: PaginatorState): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const page = Math.floor((event.first ?? 0) / (event.rows ?? 12)) + 1;
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 12);
    this.getAllProducts(this.categoryId, page);
  }

  // Navigation methods
  goToNextPage(): void {
    if (!this.isLastPage()) {
      const nextPage = this.currentPage() + 1;
      this.first.set((nextPage - 1) * this.rows());
      this.getAllProducts(this.categoryId, nextPage);
    }
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      const previousPage = this.currentPage() - 1;
      this.first.set((previousPage - 1) * this.rows());
      this.getAllProducts(this.categoryId, previousPage);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.first.set((page - 1) * this.rows());
      this.getAllProducts(this.categoryId, page);
    }
  }
}