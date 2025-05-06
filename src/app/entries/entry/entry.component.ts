import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonebookEntry } from '../../models/phonebook-entry';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss',
})
export class EntryComponent {
  @Input() entry!: PhonebookEntry;
}
