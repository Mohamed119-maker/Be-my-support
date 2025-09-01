import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor(private httpClient: HttpClient) { }

  chatWhatsApp(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/products/contact/${id}`,
      {
        headers: {
          'ttoken': `bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

}
