import { container } from "tsyringe";
import { ILogger } from "@abstractions/logging";
import {
  IEmailNotificationData,
  IPushNotificationData,
  ISMSNotificationData,
  INotificationStrategy
} from "@abstractions/interfaces";
import { EmailStrategy, PushStrategy, SMSStrategy } from "./infrastructure/notification-strategies";
import { Logger } from "@infrastructure/logging/logger";
import { NotificationWorker } from "@infrastructure/workers/notification-worker";
import { IWorker } from "@abstractions/worker";

export async function registerServices() {
  container.registerSingleton<INotificationStrategy<IEmailNotificationData>>(EmailStrategy);
  container.registerSingleton<INotificationStrategy<IPushNotificationData>>(PushStrategy);
  container.registerSingleton<INotificationStrategy<ISMSNotificationData>>(SMSStrategy);
  container.registerSingleton<ILogger>("Logger", Logger);
  container.register<IWorker>("NotificationWorker", NotificationWorker);

  container.resolve<ILogger>("Logger").logDebug("Service registration complete...✅");
}
