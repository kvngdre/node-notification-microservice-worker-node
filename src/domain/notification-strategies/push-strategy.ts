import { injectable } from "tsyringe";
import { INotificationResult, IPushNotificationData } from "@domain/interfaces";
import { INotificationStrategy } from "@domain/interfaces/notification-strategy-interface";

@injectable()
export class PushStrategy implements INotificationStrategy<IPushNotificationData> {
  constructor() {}

  send(notification: IPushNotificationData): Promise<INotificationResult> {
    throw new Error("Method not implemented.");
  }
}
