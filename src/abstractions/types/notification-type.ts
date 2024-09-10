import { IEmailNotification, IPushNotification, ISMSNotification } from "src/abstractions/interfaces";

export type NotificationType = IEmailNotification | ISMSNotification | IPushNotification;
