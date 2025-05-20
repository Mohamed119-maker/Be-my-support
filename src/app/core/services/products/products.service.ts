import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }
  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/categories`)
  }


  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/products`);
  }
  getAllProductsPagination(idCat?: string, page: number = 1, size: number = 10): Observable<any> {
    const params: any = {
      page: page.toString(),
      size: size.toString(),
    };
    if (idCat) {
      params.category = idCat;
    }

    return this.httpClient.get(`${environment.baseUrl}/products/getproducts`, {
      params
    });
  }

  getSpecProduct(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/products/${id}`);
  }

  getUserData(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/user/getproducts`)
  }

  addproduct(product: object) {
    return this.httpClient.post(`${environment.baseUrl}/products/`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/products/${id}`)
  }

  updateProduct(id: string, product: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/products/${id}`, product)
  }

}
