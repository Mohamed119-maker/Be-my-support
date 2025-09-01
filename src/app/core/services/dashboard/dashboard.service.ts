import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  numOfCategories: WritableSignal<number> = signal(0);
  numOfProducts: WritableSignal<number> = signal(0);
  // numOfUsers: WritableSignal<number> = signal(0);


  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/categories`)
  }


  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/products`);
  }

  getSpeceficProduct(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/products/${id}`);
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/products/${id}`);
  }

  updateProduct(id: string, product: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/products/${id}`, product);
  }

  deleteCategory(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/categories/${id}`);
  }

  addCategory(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/categories/addCategory`, data);
  }

  updateCategory(id: string, category: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/categories/${id}`, category);
  }

  getSpeceficCategory(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/categories/${id}`);
  }

  getAllUsers(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/user/`);
  }

  getSpeceficUser(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/user/${id}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/user/deleteuser/${id}`);
  }

}
