import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() deleteEntry = new EventEmitter<number>();
  @Output() editEntry = new EventEmitter<PhonebookEntry>();

  onDelete() {
    this.deleteEntry.emit(this.entry.id);
  }

  onEdit() {
    this.editEntry.emit(this.entry);
  }
}
