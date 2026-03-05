import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { toast} from 'ngx-sonner'
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
 protected readonly toast = toast;
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

 onLogin() {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // 1. Get the role from the token we just saved
        const role = this.authService.getRoleFromToken();
        console.log('Login Successful! User Role:', role);

        // 2. Navigation logic based on your Backend Role names
        if (role === 'ADMIN') {
          this.router.navigate(['admin/']);
        } else if (role === 'MANAGER') {
          this.router.navigate(['manager/']);
        } else if (role === 'EMPLOYEE') {
          this.router.navigate(['user/']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        toast.success("Login Successfull")
      },
      error: (err) => {
        console.error('Login Error:', err);
        toast.error("Login Failed, please try again later")
        // alert(err.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }
}
}
