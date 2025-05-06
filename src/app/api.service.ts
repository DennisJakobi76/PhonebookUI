import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PhonebookEntry } from './models/phonebook-entry';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrlSubject = new BehaviorSubject<string>('');
  private apiStatusSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  setApiUrl(url: string) {
    this.apiUrlSubject.next(url);
  }

  getApiUrl(): Observable<string> {
    return this.apiUrlSubject.asObservable();
  }

  getApiStatus(): Observable<boolean> {
    return this.apiStatusSubject.asObservable();
  }

  checkApi(url: string): Observable<any> {
    return this.http.get(`${url}/api/phonebook`).pipe(
      tap(
        () => {
          this.apiStatusSubject.next(true);
          this.setApiUrl(url);
        },
        () => {
          this.apiStatusSubject.next(false);
          this.setApiUrl('');
        }
      )
    );
  }

  getEntries(
    apiUrl: string,
    searchTerm: string = ''
  ): Observable<PhonebookEntry[]> {
    const url = searchTerm
      ? `${apiUrl}/api/phonebook?name=${searchTerm}`
      : `${apiUrl}/api/phonebook`;
    return this.http.get<PhonebookEntry[]>(url);
  }
}
