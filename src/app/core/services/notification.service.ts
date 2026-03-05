import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl + '/notifications';

  constructor(private http: HttpClient) {}

  /**
   * Starts a polling stream that fetches notifications every 10 seconds.
   * shareReplay(1) ensures that multiple components can subscribe to 
   * this same stream without triggering multiple API calls.
   */
  getNotificationsPolling(): Observable<any[]> {
    return timer(0, 10000).pipe(
      switchMap(() => this.getNotifications()),
      shareReplay(1) 
    );
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {});
  }
} 