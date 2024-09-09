import { ISender } from "@application/abstractions/sender/sender-interface";
import { EmailNotification } from "@domain/notification-strageties/email-notification";

class Sender implements ISender<EmailNotification> {
  send(data: EmailNotification): void {
    throw new Error("Method not implemented.");
  }
}
