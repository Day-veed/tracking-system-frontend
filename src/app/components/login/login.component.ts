import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatProgressSpinnerModule,
    HeaderComponent
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.isLoading = true;
    this.errorMessage = null;

    // Simulate an HTTP request (replace this with actual login logic)
    setTimeout(async() => {
      this.isLoading = false;

      // Simulated login success/failure
      try {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    }, 2000); // Simulated delay
  }
  
}