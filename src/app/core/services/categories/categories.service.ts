import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }
  getAllCategories(): Observable<any> {
    return this.httpClient.get("https://be-your-support.vercel.app/categories/")
  }
}