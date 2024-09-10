import { NotificationChannel } from "@domain/enums/notification-channel-enum";

export class EmailNotification {
  public readonly channel: NotificationChannel = NotificationChannel.EMAIL;

  constructor(
    public readonly alias: string,
    public readonly from: string,
    public readonly to: string,
    public readonly subject: string,
    public readonly body: string,
    public readonly attachments?: { filename: string; content: Buffer }[]
  ) {}
}
