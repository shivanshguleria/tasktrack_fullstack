import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { WebsocketService } from '../../core/services/websocket.service';

@Component({
  selector: 'app-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bell.html'
})
export class BellComponent implements OnInit {

  notifications: any[] = [];
  unreadCount = 0;
  open = false;

  constructor(
    private notificationService: NotificationService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {

    // 🔹 Load old notifications from DB
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      this.calculateUnread();
    });

    // 🔹 Listen for new notifications (real-time)
    this.websocketService.connect((newNotification) => {
      this.notifications.unshift(newNotification);
      this.calculateUnread();
    });
  }

  calculateUnread() {
    this.unreadCount =
      this.notifications.filter(n => n.status === 'UNREAD').length;
  }

  toggle() {
    this.open = !this.open;
  }

  markRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      const notification = this.notifications.find(n => n.notificationId === notificationId);
      if (notification) {
        notification.status = 'READ';
        this.calculateUnread();
      }
    });
  }
}
