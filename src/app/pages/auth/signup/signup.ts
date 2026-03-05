import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Department } from '../../../shared/enums/department.enum';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  // Get keys from our Enum to populate the dropdown
  departmentOptions = Object.values(Department);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      // Matches @Size(min=4, max=20) and @Pattern(regexp="^[a-zA-Z]+$")
      userName: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(20), 
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      // Matches your Email Pattern
      email: ['', [
        Validators.required, 
        Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$')
      ]],
      password: ['', [Validators.required]],
      department: ['', [Validators.required]]
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (res) => {
          // Your backend returns: "Signup successful! Please wait for Admin activation."
          // alert(res.message);
          toast.success(res.message)
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Captures your UserAlreadyExistsException
          console.error(err);
          toast.error("Error during signup, please try again later")
          // alert(err.error?.message || 'Error during signup. Please try again.');
        }
      });
    }
  }
}