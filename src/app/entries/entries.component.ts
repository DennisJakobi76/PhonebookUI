import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EntryComponent } from './entry/entry.component';
import { ApiService } from '../api.service';
import { PhonebookEntry } from '../models/phonebook-entry';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [EntryComponent, CommonModule, FormsModule],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss',
})
export class EntriesComponent implements OnInit, OnDestroy {
  entries: PhonebookEntry[] = [];
  searchTerm: string = '';
  private currentApiUrl: string = '';
  private subscriptions: Subscription[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Subscribe to API URL changes
    this.subscriptions.push(
      this.apiService.getApiUrl().subscribe((apiUrl) => {
        this.currentApiUrl = apiUrl;
        if (apiUrl) {
          this.loadEntries();
        }
      })
    );

    // Subscribe to API status changes
    this.subscriptions.push(
      this.apiService.getApiStatus().subscribe((isAvailable) => {
        if (!isAvailable) {
          this.entries = [];
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    if (this.currentApiUrl) {
      this.loadEntries();
    }
  }

  private loadEntries() {
    this.apiService.getEntries(this.currentApiUrl, this.searchTerm).subscribe({
      next: (entries) => (this.entries = entries),
      error: () => (this.entries = []),
    });
  }

  handleDelete(id: number) {
    this.entries = this.entries.filter((entry) => entry.id !== id);
  }
}
