import { Component, inject, OnInit, PLATFORM_ID, } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { isPlatformBrowser } from '@angular/common';
import { Iproducts } from '../../../shared/interfaces/iproducts';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-wishlist',
  imports: [ButtonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService)
  allProduct: Iproducts[] = []
  platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllProduct()
    }
  }
  getAllProduct() {
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        console.log(res.data.wishlist);
        this.allProduct = res.data.wishlist

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  deleteProduct(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.wishlistService.deleteProductFromWishlist(id).subscribe({
          next: (res) => {
            console.log(res);
            this.wishlistService.wishlistNumber.set(res.data.wishlist.length);
            this.getAllProduct();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }
}
