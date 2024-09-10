import { NotificationChannel } from "@domain/enums/notification-channel-enum";

export interface IEmailNotification {
  channel: NotificationChannel.EMAIL;
  data: IEmailNotificationData;
}

export interface IEmailNotificationData {
  alias: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  attachments?: { filename: string; content: Buffer }[];
}
