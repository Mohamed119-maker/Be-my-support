import { ICategory } from '../../shared/interfaces/ICategory';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { Iproducts } from '../../shared/interfaces/iproducts';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-products',
  imports: [CommonModule,
    AccordionModule,
    SliderModule,
    ButtonModule,
    FormsModule, CardComponent, PaginatorModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);
  selectedCat: WritableSignal<any> = signal('All Products')
  categoryDetails: ICategory[] = [];
  allProducts = signal<Iproducts[]>([]);

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  categoryId?: string;
  wishlistService = inject(WishlistService)
  allProductWishlist: Iproducts[] = []
  filterArr: Iproducts[] = []
  platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllCategories()
      this.getAllProducts();
      this.getAllProductWishlist()
    }
  }
  getAllCategories() {
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data)
        // this.categories=res.data.name
        this.categoryDetails = res.data;
      }
    })
  }
  getAllProducts(idCat?: string, page: number = 1, size: number = this.rows) {
    this.categoryId = idCat;
    this.first = 0;
    this.productsService.getAllProductsPagination(idCat, page, size).subscribe({
      next: (res) => {
        console.log(res);
        this.allProducts.set(res.data);
        this.totalRecords = res.results;
      }
    });
  }

  getAllProductWishlist() {
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        console.log(res.data.wishlist);
        this.allProductWishlist = res.data.wishlist

      }
    })
  }
  isInWishlist(productId: string): boolean {
    return this.allProductWishlist.some(p => p._id === productId);
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    const page = Math.floor(this.first / this.rows) + 1;
    this.getAllProducts(this.categoryId, page, this.rows);
  }
}