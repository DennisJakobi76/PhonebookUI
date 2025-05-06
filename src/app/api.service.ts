import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PhonebookEntry } from './models/phonebook-entry';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private selectedApiUrl = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  setApiUrl(url: string) {
    this.selectedApiUrl.next(url);
  }

  getApiUrl() {
    return this.selectedApiUrl.asObservable();
  }

  checkApi(apiUrl: string): Observable<any> {
    if (apiUrl) {
      this.setApiUrl(apiUrl);
    }
    return this.http.get(`${apiUrl}/api/phonebook`);
  }

  getEntries(
    apiUrl: string,
    searchTerm?: string
  ): Observable<PhonebookEntry[]> {
    const url = searchTerm
      ? `${apiUrl}/api/phonebook?name=${searchTerm}`
      : `${apiUrl}/api/phonebook`;
    return this.http.get<PhonebookEntry[]>(url);
  }
}
