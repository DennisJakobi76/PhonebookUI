import { Component, HostBinding, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhonebookEntry } from '../../models/phonebook-entry';

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entry-detail.component.html',
  styleUrl: './entry-detail.component.scss',
})
export class EntryDetailComponent {
  @HostBinding('class.visible')
  isVisible = false;

  @Output() save = new EventEmitter<{
    id?: number;
    entry: Omit<PhonebookEntry, 'id'>;
  }>();

  entry: Omit<PhonebookEntry, 'id'> = this.getEmptyEntry();
  editId?: number;

  show(existingEntry?: PhonebookEntry) {
    this.isVisible = true;
    if (existingEntry) {
      this.editId = existingEntry.id;
      this.entry = {
        vorname: existingEntry.vorname,
        nachname: existingEntry.nachname,
        telefonVorwahl: existingEntry.telefonVorwahl,
        telefonnummer: existingEntry.telefonnummer,
      };
    } else {
      this.resetForm();
    }
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
  }

  onSave() {
    this.save.emit({
      id: this.editId,
      entry: this.entry,
    });
    this.hide();
  }

  private resetForm() {
    this.entry = this.getEmptyEntry();
    this.editId = undefined;
  }

  private getEmptyEntry(): Omit<PhonebookEntry, 'id'> {
    return {
      vorname: '',
      nachname: '',
      telefonVorwahl: '',
      telefonnummer: '',
    };
  }
}
