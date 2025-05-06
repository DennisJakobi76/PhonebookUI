import { Component } from '@angular/core';
import { EntryComponent } from './entry/entry.component';

@Component({
  selector: 'app-entries',
  imports: [EntryComponent],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss',
})
export class EntriesComponent {}
