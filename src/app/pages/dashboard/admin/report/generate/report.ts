import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { ReportService } from '../../../../../core/services/report.service';
import { HeaderComponent } from '../../../../../shared/components/header/header';

@Component({
  selector: 'app-admin-report',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './report.html'
})
export class AdminReportComponent {

  selectedDepartment: string = '';
  reportData: any = null;
  message: string = '';
  isError: boolean = false;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef 
  ) {}


  onGenerateDeptReport(): void {
    console.log('Generating report for department:', this.selectedDepartment);

    if (!this.selectedDepartment) return;
    //TODO: Add SONNAR 
    this.message = 'Generating report...';
    this.isError = false;

    this.reportService.generateDeptReport(this.selectedDepartment).subscribe({
      next: (res) => {
        this.reportData = res;
        this.message = 'Report Generated Successfully!';
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.message = 'Error generating report. Please try again.';
        this.isError = true;
        this.reportData = null;
        this.cdr.detectChanges();
      }
    });
  }
}