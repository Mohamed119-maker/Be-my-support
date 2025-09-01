import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { ProductsService } from '../../core/services/products/products.service';
import { ICategory } from '../../shared/interfaces/ICategory';
import { Iproducts } from '../../shared/interfaces/iproducts';
import { CardComponent } from "../../shared/components/card/card.component";
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CarouselModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  categories = signal<ICategory[]>([]);
  allProducts = signal<Iproducts[]>([]);
  allProductWishlist = signal<Iproducts[]>([]);
  wishlistService = inject(WishlistService)
  platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllCat();
      this.getAllProducts();
      this.getAllProductWishlist();
    }
  }


  mainSlider: OwlOptions = {
    rtl: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplaySpeed: 3000,
    autoplayHoverPause: true,
    items: 1,
    autoWidth: true,
    nav: false,
    margin: 10,

  }

  catSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplaySpeed: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  getAllCat(): void {
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res);
        this.categories.set(res.data);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }


  getAllProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.allProducts.set(res.Products);

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAllProductWishlist() {
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        console.log(res.data.wishlist);
        this.allProductWishlist.set(res.data.wishlist);

      }
    })
  }

  isInWishlist(productId: string): boolean {
    return this.allProductWishlist().some(p => p._id === productId);
  }



}
