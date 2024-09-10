import "reflect-metadata";
import "dotenv/config";
import { container } from "tsyringe";
import { NotificationWorker } from "@infrastructure/workers/notification-worker";
import { registerServices } from "./dependency-injection";

async function startUp() {
  await registerServices();

  const notificationWorker = container.resolve(NotificationWorker);
  await notificationWorker.execute();
}

startUp();
