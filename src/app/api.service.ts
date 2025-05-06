import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  checkApi(apiUrl: string): Observable<any> {
    return this.http.get(`${apiUrl}/api/phonebook`);
  }
}
