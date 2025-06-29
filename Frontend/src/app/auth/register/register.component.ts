import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,MatButtonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  logoUrl: string;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[A-Za-z0-9+_.-]+@(.+)$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
    this.logoUrl = 'assets/images/lapeyre-logo.jpg';
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const username = this.registerForm.get('username')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      console.log('Submitting registration form:', {
        username,
        email,
        passwordLength: password?.length
      });

      this.authService.register(username, email, password).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          if (error.error && error.error.error) {
            this.errorMessage = error.error.error;
          } else if (error.error && typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
        }
      });
    } else {
      console.log('Form validation errors:', this.registerForm.errors);
      this.errorMessage = 'Please fill in all required fields correctly';
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.errors) {
          console.log(`Validation errors for ${key}:`, control.errors);
        }
        control?.markAsTouched();
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please provide a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters long`;
    }
    if (control?.hasError('pattern')) {
      switch (controlName) {
        case 'username':
          return 'Username can only contain letters, numbers, and underscores';
        case 'email':
          return 'Please provide a valid email address';
        case 'password':
          return 'Password must be at least 6 characters long';
        default:
          return 'Invalid format';
      }
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
} 