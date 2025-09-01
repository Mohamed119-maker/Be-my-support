import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IUsers } from '../../shared/interfaces/iusers';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  imports: [],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly wishlistService = inject(WishlistService);
  private readonly id = inject(PLATFORM_ID);
  allUsers = signal<IUsers[]>([]);
  selectedUser: IUsers = {} as IUsers;
  showInfo: WritableSignal<boolean> = signal(false);



  ngOnInit(): void {
    if (isPlatformBrowser(this.id)) {
      this.getAllUsers();
    }
  }

  openUserModal(user: any) {
    this.selectedUser = user;
  }


  getAllUsers(): void {
    this.dashboardService.getAllUsers().subscribe({
      next: (res) => {
        this.allUsers.set(res.data);
        console.log(this.allUsers());
      }
    })
  }

  viewSpeceficUser(id: string): void {
    this.dashboardService.getSpeceficUser(id).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedUser = res.data;
        this.showInfo.set(true);
      }
    })
  }



  deleteUserByAdmin(id: string): void {
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
        this.dashboardService.deleteUser(id).subscribe({
          next: (res) => {
            Swal.fire({
              title: "Deleted!",
              text: res.message,
              icon: "success",

            });
            this.getAllUsers();

          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your imaginary user is safe :)",
          icon: "error"
        });
      }
    });




  }


  closeModal(event: MouseEvent) {
    this.showInfo.set(false); // يقفل المودال
  }


}
