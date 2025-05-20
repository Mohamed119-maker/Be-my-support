import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpClient: HttpClient, private toastrService: ToastrService) { }
  wishlistNumber: WritableSignal<number> = signal(0)

  success(message: string): void {
    this.toastrService.success(message, 'Be My Support');
  }

  error(message: string): void {
    this.toastrService.error(message, 'Be My Support');
  }
  getAllProductWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/wishlist/`, {
      headers: {
        ttoken: `bearer ${localStorage.getItem('token')}`
      }
    })
  }
  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/wishlist/`,
      {
        productId: id
      },
      {
        headers: {
          ttoken: `bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
  deleteProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/wishlist/${id}`,
      {}, {
      headers: {
        ttoken: `bearer ${localStorage.getItem('token')}`
      }
    }
    );
  }


}
