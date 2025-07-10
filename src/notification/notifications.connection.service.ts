import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsConnectionService {
  private activeConnections = new Map<number, boolean>();
  private pendingNotifications = new Map<number, Notification[]>();

  addConnection(userId: number): void {
    this.activeConnections.set(userId, true);
  }

  removeConnection(userId: number): void {
    this.activeConnections.delete(userId);
  }

  isUserConnected(userId: number): boolean {
    return this.activeConnections.has(userId);
  }

  addPendingNotification(userId: number, notification: Notification): void {
    const notifications = this.pendingNotifications.get(userId) || [];
    notifications.push(notification);
    this.pendingNotifications.set(userId, notifications);
  }

  getPendingNotifications(userId: number): Notification[] {
    return this.pendingNotifications.get(userId) || [];
  }

  clearPendingNotifications(userId: number): void {
    this.pendingNotifications.delete(userId);
  }
}