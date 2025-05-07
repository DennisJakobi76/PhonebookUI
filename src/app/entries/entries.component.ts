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
          entry.firstName.toLowerCase().includes(this.searchTerm) ||
          entry.lastName.toLowerCase().includes(this.searchTerm) ||
          entry.phonePrefix.toLowerCase().includes(this.searchTerm)
      )
    );
  }

  private loadEntries() {
    this.apiService.getEntries(this.currentApiUrl).subscribe({
      next: (entries) => {
        this.allEntries = entries;
        this.filterEntries();
      },
      error: (error) => {
        console.error('Error loading entries:', error);
        this.entries = [];
        this.allEntries = [];
        // Hier könnte eine Fehlermeldung für den Benutzer angezeigt werden
      },
    });
  }

  handleDelete(id: number) {
    this.apiService.deleteEntry(this.currentApiUrl, id).subscribe({
      next: () => {
        this.allEntries = this.allEntries.filter((entry) => entry.id !== id);
        this.filterEntries();
      },
      error: (error) => {
        console.error('Error deleting entry:', error);
        // Hier könnte eine Fehlermeldung für den Benutzer angezeigt werden
      },
    });
  }

  showEntryDetail(entry?: PhonebookEntry) {
    this.entryDetail.show(entry);
  }

  handleSave(data: { id?: number; entry: Omit<PhonebookEntry, 'id'> }) {
    if (data.id) {
      // Update existing entry
      this.apiService
        .updateEntry(this.currentApiUrl, data.id, data.entry)
        .subscribe({
          next: () => {
            // Nach erfolgreichem Update alle Einträge neu laden
            this.loadEntries();
          },
          error: (error) => {
            console.error('Error updating entry:', error);
          },
        });
    } else {
      // Create new entry
      this.apiService.createEntry(this.currentApiUrl, data.entry).subscribe({
        next: () => {
          // Nach erfolgreichem Erstellen alle Einträge neu laden
          this.loadEntries();
        },
        error: (error) => {
          console.error('Error creating entry:', error);
        },
      });
    }
  }

  addNewEntry(entryData: Omit<PhonebookEntry, 'id'>) {
    this.apiService.createEntry(this.currentApiUrl, entryData).subscribe({
      next: (newEntry) => {
        this.allEntries = [...this.allEntries, newEntry];
        this.filterEntries();
      },
      error: (error) => {
        console.error('Error creating entry:', error);
        // Hier könnte eine Fehlermeldung für den Benutzer angezeigt werden
      },
    });
  }

  private sortEntriesById(entries: PhonebookEntry[]): PhonebookEntry[] {
    return entries.sort((a, b) => a.id - b.id);
  }
}
