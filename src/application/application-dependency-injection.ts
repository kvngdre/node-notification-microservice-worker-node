import { container } from "tsyringe";
import { EmailStrategy, PushStrategy, SMSStrategy } from "./notification-strategies";
import {
  IEmailNotificationData,
  INotificationStrategy,
  IPushNotificationData,
  ISMSNotificationData
} from "@domain/interfaces";

export function registerApplicationServices() {
  container.registerSingleton<INotificationStrategy<IEmailNotificationData>>(EmailStrategy);
  container.registerSingleton<INotificationStrategy<IPushNotificationData>>(PushStrategy);
  container.registerSingleton<INotificationStrategy<ISMSNotificationData>>(SMSStrategy);
}
