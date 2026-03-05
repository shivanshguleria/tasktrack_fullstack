import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { UserResponseDto} from '../../../../shared/models/user.model';
import { Role } from '../../../../shared/enums/role.enum';
import { Status } from '../../../../shared/enums/status.enum';
import { Department } from '../../../../shared/enums/department.enum';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, BackButtonComponent],
  templateUrl: './manage-users.html'
})
export class ManageUsersComponent implements OnInit {
  allUsers: UserResponseDto[] = [];
  selectedUser: UserResponseDto | null = null;
  deleteUserTarget: UserResponseDto | null = null; 
  editForm: FormGroup;
  isLoading = false;

  roles = Object.values(Role);
  statuses = Object.values(Status);

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.editForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.allUsers = res.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        
        this.isLoading = false
        toast.error("Error loading users")
      }
    });
  }


  openDeleteModal(user: UserResponseDto): void {
    this.deleteUserTarget = user;
  }

  closeDeleteModal(): void {
    this.deleteUserTarget = null;
  }

  confirmDelete(): void {
    if (this.deleteUserTarget) {
      this.adminService.deleteUser(this.deleteUserTarget.userId).subscribe({
        next: (res) => {
          this.closeDeleteModal();
          toast.info("User with id: " + this.deleteUserTarget?.userId + "was deleted")
          this.loadUsers();
        },
        error: (err) => {
          toast.error(err.error?.message || 'Delete failed')
          // alert(err.error?.message || 'Delete failed');
          this.closeDeleteModal();
        }
      });
    }
  }


  openEditModal(user: UserResponseDto): void {
    this.selectedUser = user;
    this.editForm.patchValue(user);
  }

  onUpdate(): void {
    if (this.selectedUser && this.editForm.valid) {
      this.adminService.updateUser(this.selectedUser.userId, this.editForm.value).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => toast.error(err.error?.message || 'Update failed')
        
      });
    }
  }

  closeModal(): void { this.selectedUser = null; }
}