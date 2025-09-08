import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['admin', Validators.required],
      password: ['admin123', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login successful!', response);
          // Use role-based navigation instead of generic dashboard
          this.authService.redirectToDashboard(response.user);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Invalid username or password';
          console.error('Login failed:', error);
        }
      });
    }
  }
}