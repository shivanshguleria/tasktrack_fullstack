import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  
  private readonly apiUrl = environment.apiUrl + '/reports';

  constructor(private http: HttpClient) {}

  generateDeptReport(deptName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/department/${deptName}`, {});
  }


  generateUserReport(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}`, {});
  }

  getAllReports(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`);
}

deleteReport(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

getManagerTeamReports(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/reports/team`);
}

// Fetches reports specifically for one user
getReportsByUserId(userId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/reports/user/${userId}`);
}

}