import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { Iproducts } from './../../../shared/interfaces/iproducts';
import { IUserData } from './../../../shared/interfaces/iuser-data';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  userInfo: IUserData = {} as IUserData;


  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getUserData();
    }

  }

  getUserData(): void {
    this.productsService.getUserData().subscribe({
      next: (res) => {
        console.log(res);
        this.userInfo = res.data
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
        this.productsService.deleteProduct(id).subscribe({
          next: (res) => {
            console.log(res);
            this.getUserData();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        })

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
