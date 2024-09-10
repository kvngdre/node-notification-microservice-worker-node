import { INotificationResult, ISMSNotificationData } from "@domain/interfaces";
import { INotificationStrategy } from "@domain/interfaces/notification-strategy-interface";

export class SMSStrategy implements INotificationStrategy<ISMSNotificationData> {
  constructor() {}

  send(notification: ISMSNotificationData): Promise<INotificationResult> {
    throw new Error("Method not implemented.");
  }
}
