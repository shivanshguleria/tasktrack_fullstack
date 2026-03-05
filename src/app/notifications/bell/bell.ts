import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { toast } from 'ngx-sonner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bell.html'
})
export class BellComponent implements OnInit, OnDestroy {
  notifications = signal<any[]>([]);
  unreadCount = signal(0);
  open = false;
  
  private pollingSub?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // 🔹 Start Polling (Every 10 seconds)
    this.pollingSub = this.notificationService.getNotificationsPolling().subscribe({
      next: (data) => {
        // If the new list is longer than our current list, show a toast
        if (data.length > this.notifications().length && this.notifications().length > 0) {
          toast("You have new notifications");
        }
        
        this.notifications.set(data);
        this.calculateUnread();
      },
      error: (err) => console.error('Notification polling failed', err)
    });
  }

  calculateUnread() {
    const count = this.notifications().filter(n => n.status === 'UNREAD').length;
    this.unreadCount.set(count);
  }

  toggle() {
    this.open = !this.open;
  }

  markRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Update local state for immediate UI feedback
        this.notifications.update(list => 
          list.map(n => n.notificationId === notificationId ? { ...n, status: 'READ' } : n)
        );
        this.calculateUnread();
      }
    });
  }

  ngOnDestroy(): void {
    // 🔹 Important: Stop the timer when component is destroyed
    this.pollingSub?.unsubscribe();
  }
}