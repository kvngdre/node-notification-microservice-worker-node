import { NotificationChannel } from "@domain/enums/notification-channel-enum";

export interface IPushNotification {
  channel: NotificationChannel.PUSH;
  data: IPushNotificationData;
}

export interface IPushNotificationData {
  deviceToken: string;
  title: string;
  body: string;
  imageUrl?: string;
}
