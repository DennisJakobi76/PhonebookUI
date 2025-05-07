import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-detail.component.html',
  styleUrl: './entry-detail.component.scss',
})
export class EntryDetailComponent {
  @HostBinding('class.visible')
  isVisible = false;

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}
