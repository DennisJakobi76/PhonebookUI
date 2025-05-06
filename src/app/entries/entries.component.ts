import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { ApiService } from '../api.service';
import { PhonebookEntry } from '../models/phonebook-entry';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [EntryComponent, CommonModule],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss',
})
export class EntriesComponent implements OnInit {
  entries: PhonebookEntry[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getApiUrl().subscribe((apiUrl) => {
      if (apiUrl) {
        this.apiService
          .getEntries(apiUrl)
          .subscribe((entries) => (this.entries = entries));
      }
    });
  }
}
