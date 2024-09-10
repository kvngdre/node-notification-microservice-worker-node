import { INotificationResult, ISMSNotificationData } from "@application/abstractions/interfaces";
import { INotificationStrategy } from "@application/abstractions/interfaces/notification-strategy-interface";

export class SMSStrategy implements INotificationStrategy<ISMSNotificationData> {
  constructor() {}

  send(notification: ISMSNotificationData): Promise<INotificationResult> {
    throw new Error("Method not implemented.");
  }
}
