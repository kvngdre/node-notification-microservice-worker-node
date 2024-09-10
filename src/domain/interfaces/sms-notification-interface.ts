import { NotificationChannel } from "@domain/enums/notification-channel-enum";

export interface ISMSNotification {
  channel: NotificationChannel.SMS;
  data: ISMSNotificationData;
}

export interface ISMSNotificationData {
  to: string;
  body: string;
}
