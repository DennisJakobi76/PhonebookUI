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

  @Output() save = new EventEmitter<Omit<PhonebookEntry, 'id'>>();

  entry: Omit<PhonebookEntry, 'id'> = {
    vorname: '',
    nachname: '',
    telefonVorwahl: '',
    telefonnummer: '',
  };

  show() {
    this.isVisible = true;
    this.resetForm();
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
  }

  onSave() {
    this.save.emit(this.entry);
    this.hide();
  }

  private resetForm() {
    this.entry = {
      vorname: '',
      nachname: '',
      telefonVorwahl: '',
      telefonnummer: '',
    };
  }
}
