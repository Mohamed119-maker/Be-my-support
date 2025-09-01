import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Iproducts } from '../../../shared/interfaces/iproducts';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly platformId = inject(PLATFORM_ID);

  isLoading: WritableSignal<boolean> = signal(true);
  wishlistItems: WritableSignal<Iproducts[]> = signal([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllProduct();
    }
  }

  getAllProduct() {
    this.isLoading.set(true);
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.data.wishlist);
      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
        this.wishlistService.error('Failed to load wishlist');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: "Remove from Wishlist?",
      text: "Are you sure you want to remove this item from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.wishlistService.deleteProductFromWishlist(id).subscribe({
          next: (res) => {
            // Update wishlist count
            this.wishlistService.wishlistNumber.set(res.data.wishlist.length);
            // Update local wishlist items
            this.wishlistItems.set(this.wishlistItems().filter(item => item._id !== id));

            this.wishlistService.success('Item removed from wishlist');
          },
          error: (err) => {
            console.error('Error removing item:', err);
            this.wishlistService.error('Failed to remove item from wishlist');
          }
        });
      }
    });
  }
}
