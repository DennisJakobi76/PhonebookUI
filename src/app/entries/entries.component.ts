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
  entries: PhonebookEntry[] = []; // Gefilterte Einträge zur Anzeige
  private allEntries: PhonebookEntry[] = []; // Alle Einträge im Speicher
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
          this.allEntries = [];
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterEntries();
  }

  private filterEntries() {
    if (!this.searchTerm) {
      this.entries = this.sortEntriesById([...this.allEntries]);
      return;
    }

    this.entries = this.sortEntriesById(
      this.allEntries.filter(
        (entry) =>
          entry.vorname.toLowerCase().includes(this.searchTerm) ||
          entry.nachname.toLowerCase().includes(this.searchTerm) ||
          entry.telefonVorwahl.toLowerCase().includes(this.searchTerm)
      )
    );
  }

  private loadEntries() {
    this.apiService.getEntries(this.currentApiUrl).subscribe({
      next: (entries) => {
        this.allEntries = entries;
        this.filterEntries();
      },
      error: () => {
        this.entries = [];
        this.allEntries = [];
      },
    });
  }

  handleDelete(id: number) {
    this.allEntries = this.allEntries.filter((entry) => entry.id !== id);
    this.filterEntries();
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

    this.allEntries = [...this.allEntries, newEntry];
    this.filterEntries();
  }

  private getNextAvailableId(): number {
    if (this.allEntries.length === 0) {
      return 1;
    }

    const usedIds = new Set(this.allEntries.map((entry) => entry.id));
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
