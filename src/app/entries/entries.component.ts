import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
export class EntriesComponent implements OnInit {
  entries: PhonebookEntry[] = [];
  searchTerm: string = '';
  private currentApiUrl: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getApiUrl().subscribe((apiUrl) => {
      if (apiUrl) {
        this.currentApiUrl = apiUrl;
        this.loadEntries();
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.loadEntries();
  }

  private loadEntries() {
    this.apiService
      .getEntries(this.currentApiUrl, this.searchTerm)
      .subscribe((entries) => (this.entries = entries));
  }
}
