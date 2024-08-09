import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    HeaderComponent
  ]
})
export class UploadComponent {
  selectedFile: File | null = null;

  constructor(private reportService: ReportService, private snackBar: MatSnackBar) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (this.selectedFile) {
      try {
        console.log('Uploading file...');
        await this.reportService.uploadReport(this.selectedFile);
        console.log('File uploaded successfully'); // Debugging line
        this.snackBar.open('File uploaded successfully', 'Close', {
          duration: 3000,
        });
      } catch (error) {
        console.error('File upload failed', error);
        console.log('File upload failed'); // Debugging line
        this.snackBar.open('File upload failed', 'Close', {
          duration: 3000,
        });
      }
    }
  }
}
