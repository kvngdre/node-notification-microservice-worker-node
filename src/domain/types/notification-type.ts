import { IEmailNotification, IPushNotification, ISMSNotification } from "@domain/interfaces";

export type NotificationType = IEmailNotification | ISMSNotification | IPushNotification;
