"notification-strategy-interface.ts";

export interface INotificationStrategy<T> {
  send(notification: T): void;
}
