import { Component, inject, Input } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  wishlistService = inject(WishlistService)
  @Input() imageCover: string = ''
  @Input() finalPrice!: number
  @Input() description: string = ''
  @Input() price!: number
  @Input() discount!: number
  @Input() createdAt!: string
  @Input() title!: string
  @Input() productId!: string
  @Input() address?: string
  @Input() liked!: boolean


  addProdToWish(id: string) {
    if (localStorage.getItem('token') !== null) {
      this.wishlistService.addProductToWishlist(id).subscribe({
        next: (res) => {
          console.log(res);
          this.liked = true;
          this.wishlistService.wishlistNumber.set(res.data.length);
          this.wishlistService.success(res.message);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.wishlistService.error('You should login first')
    }

  }

  deleteProduct(id: string) {
    this.wishlistService.deleteProductFromWishlist(id).subscribe({
      next: (res) => {
        console.log(res);
        this.liked = false
        this.wishlistService.wishlistNumber.set(res.data.wishlist.length)
        console.log(res.data.wishlist.length);
        this.wishlistService.success('Removed Successfully')
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
