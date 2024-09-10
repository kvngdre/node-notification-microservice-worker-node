import "reflect-metadata";
import "dotenv/config";
import { container } from "tsyringe";
import { NotificationWorker } from "@infrastructure/workers/notification-worker";
import { registerServices } from "./dependency-injection";

registerServices();

const notificationWorker = container.resolve(NotificationWorker);
notificationWorker.execute();
