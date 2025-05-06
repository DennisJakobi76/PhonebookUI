import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-port-switch',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './port-switch.component.html',
  styleUrl: './port-switch.component.scss',
})
export class PortSwitchComponent {
  selectedApi: string = '';
  apiStatus: 'ok' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  checkApiStatus() {
    if (this.selectedApi) {
      this.apiService.checkApi(this.selectedApi).subscribe(
        () => (this.apiStatus = 'ok'),
        () => (this.apiStatus = 'error')
      );
    }
  }
}
