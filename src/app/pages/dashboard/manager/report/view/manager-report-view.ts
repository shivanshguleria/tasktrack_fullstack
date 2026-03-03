import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for the search input
import { ReportService } from '../../../../../core/services/report.service';
import { HeaderComponent } from '../../../../../shared/components/header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manager-report-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, FormsModule], // Ensure FormsModule is here
  templateUrl: './manager-view-report.html'
})
export class ManagerReportListComponent implements OnInit {
  reports: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  targetUserId: string = ''; // Property to store the searched User ID

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // You can choose to load all on init, or leave it empty until search
    this.fetchReports(); 
  }

  // This method now handles both "All" and "Specific User"
  fetchReports(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Logic: If targetUserId is provided, call user-specific API, otherwise call all.
    const request = this.targetUserId.trim() 
      ? this.reportService.getReportsByUserId(this.targetUserId) 
      : this.reportService.getAllReports();

    request.subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = this.targetUserId 
          ? `No reports found for User ID: ${this.targetUserId}` 
          : 'Failed to load report history.';
        this.reports = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteReport(id: number): void {
    if (confirm('Are you sure you want to delete this report record?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.reports = this.reports.filter(r => r.reportID !== id);
          this.cdr.detectChanges();
        },
        error: () => alert('Error deleting the report.')
      });
    }
  }
}