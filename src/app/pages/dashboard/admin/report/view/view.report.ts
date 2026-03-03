import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../../core/services/report.service';
import { HeaderComponent } from '../../../../../shared/components/header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './view.report.html'
})
export class ReportListComponent implements OnInit {
  reports: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.isLoading = true;
    this.reportService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensures table renders immediately
      },
      error: (err) => {
        this.errorMessage = 'Failed to load report history.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteReport(id: number): void {
    if (confirm('Are you sure you want to delete this report record?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          // Update local list instantly
          this.reports = this.reports.filter(r => r.reportID !== id);
          this.cdr.detectChanges();
        },
        error: () => alert('Error deleting the report.')
      });
    }
  }
}