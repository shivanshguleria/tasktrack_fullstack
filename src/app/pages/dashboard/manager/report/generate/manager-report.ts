import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../../../core/services/report.service';
import { HeaderComponent } from '../../../../../shared/components/header/header';
@Component({
  selector: 'app-manager-report',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './manager-report.html'
})
export class ManagerReportComponent {
  targetUserId: number = 0;
  reportData: any = null;
  isLoading: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(private reportService: ReportService) {}

  onGenerateUserReport(): void {
    if (!this.targetUserId) {
      this.message = 'Please enter a User ID.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.reportData = null;

    // The service call
    this.reportService.generateUserReport(this.targetUserId).subscribe({
      next: (res) => {
        this.reportData = res;
        this.isError = false;
        this.message = 'Report generated successfully.';
        this.isLoading = false;
      },
      error: (err) => {
        this.isError = true;
        this.message = err.status === 403 
          ? 'Access Denied: You can only view reports for your team.' 
          : 'User ID not found.';
        this.isLoading = false;
      }
    });
  }
}