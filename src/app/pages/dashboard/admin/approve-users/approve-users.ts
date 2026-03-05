import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button';
import { UserResponseDto } from '../../../../shared/models/user.model';
import { Role } from '../../../../shared/enums/role.enum';
import { Status } from '../../../../shared/enums/status.enum';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-approve-users',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HeaderComponent, 
    BackButtonComponent
  ],
  templateUrl: './approve-users.html'
})
export class ApproveUsersComponent implements OnInit {
  inactiveUsers: UserResponseDto[] = [];
  selectedUser: UserResponseDto | null = null;
  activationForm: FormGroup;
  roles = Object.values(Role);
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {
    this.activationForm = this.fb.group({
      role: ['', Validators.required],
      status: [Status.ACTIVE] 
    });
  }

  ngOnInit(): void {
    this.loadInactiveUsers();
  }

  loadInactiveUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.inactiveUsers = res.data.filter(user => user.status !== Status.ACTIVE);
        }
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        toast.error("Fetch failded " + err)
        console.error('Fetch failed', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openActivationModal(user: UserResponseDto): void {
    this.selectedUser = user;
    this.activationForm.patchValue({ 
      role: user.role || Role.EMPLOYEE 
    });
  }

  confirmActivation(): void {
    if (this.selectedUser && this.activationForm.valid) {
      this.adminService.activateUser(this.selectedUser.userId, this.activationForm.value).subscribe({
        next: () => {
          this.closeModal();
          toast.success("User with id " + this.selectedUser?.userId + "is now active")
          this.loadInactiveUsers(); 
        },
        error: (err) => toast.error('Activation failed: ' + (err.error?.message || 'Server error'))
      });
    }
  }

  closeModal(): void {
    this.selectedUser = null;
    this.activationForm.reset({ status: Status.ACTIVE });
  }

  goBack(): void {
    this.location.back();
  }
}