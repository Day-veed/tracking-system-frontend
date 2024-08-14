import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://report-tracking-system-08f9d809933c.herokuapp.com/api/report';

  constructor(private authService: AuthService) {}

  async uploadReport(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${this.apiUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'auth-token': this.authService.getAccessToken()
      }
    });
    return response.data;
  }

  async getRecentReports() {
    const response = await axios.get(`${this.apiUrl}/recent`, {
      headers: {
        'auth-token': this.authService.getAccessToken()
      }
    });
    return response.data;
  }

  async getAllReports() {
    const response = await axios.get(`${this.apiUrl}/all`, {
      headers: {
        'auth-token': this.authService.getAccessToken()
      }
    });
    return response.data;
  }
}
