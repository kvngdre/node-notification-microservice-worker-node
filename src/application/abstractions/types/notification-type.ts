import { IEmailNotification, IPushNotification, ISMSNotification } from "@application/abstractions/interfaces";

export type NotificationType = IEmailNotification | ISMSNotification | IPushNotification;
