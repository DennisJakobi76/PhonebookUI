import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EntryComponent } from './entry/entry.component';
import { ApiService } from '../api.service';
import { PhonebookEntry } from '../models/phonebook-entry';
import { EntryDetailComponent } from './entry-detail/entry-detail.component';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [EntryComponent, CommonModule, FormsModule, EntryDetailComponent],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss',
})
export class EntriesComponent implements OnInit, OnDestroy {
  entries: PhonebookEntry[] = [];
  searchTerm: string = '';
  private currentApiUrl: string = '';
  private subscriptions: Subscription[] = [];

  @ViewChild(EntryDetailComponent) entryDetail!: EntryDetailComponent;

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
      next: (entries) => (this.entries = this.sortEntriesById(entries)),
      error: () => (this.entries = []),
    });
  }

  handleDelete(id: number) {
    this.entries = this.sortEntriesById(
      this.entries.filter((entry) => entry.id !== id)
    );
  }

  showEntryDetail() {
    this.entryDetail.show();
  }

  addNewEntry(entryData: Omit<PhonebookEntry, 'id'>) {
    const newId = this.getNextAvailableId();
    const newEntry: PhonebookEntry = {
      id: newId,
      ...entryData,
    };

    this.entries = this.sortEntriesById([...this.entries, newEntry]);
  }

  private getNextAvailableId(): number {
    if (this.entries.length === 0) {
      return 1;
    }

    const usedIds = new Set(this.entries.map((entry) => entry.id));
    let nextId = 1;

    while (usedIds.has(nextId)) {
      nextId++;
    }

    return nextId;
  }

  private sortEntriesById(entries: PhonebookEntry[]): PhonebookEntry[] {
    return entries.sort((a, b) => a.id - b.id);
  }
}
