import { INotificationResult, ISMSNotificationData } from "src/abstractions/interfaces";
import { INotificationStrategy } from "src/abstractions/interfaces/notification-strategy-interface";

export class SMSStrategy implements INotificationStrategy<ISMSNotificationData> {
  constructor() {}

  send(notification: ISMSNotificationData): Promise<INotificationResult> {
    throw new Error("Method not implemented.");
  }
}
