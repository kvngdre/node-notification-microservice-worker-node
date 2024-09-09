import { INotificationStrategy } from "@domain/notification-strategy-interface";
import { EmailNotification } from "@domain/notifications/email-notification";

export class EmailStrategy implements INotificationStrategy<EmailNotification> {
  constructor() {}

  send(notification: EmailNotification): void {

    const mailOptions: Mail.Options = {
      from: `${options.alias}<no-reply@pulse-core.xyz>`,
      to: options.to,
      subject: options.subject,
      html: options.body
    };

    try {
      const result: MailerResponseType = (await this._transport.sendMail(mailOptions)) as MailerResponseType;

      return this._isMailAccepted(result, options.to);
    } catch (error) {
      if (error instanceof Error) {
        this._logger.logError(`Failed to email notification. Reason -> ${error.message}`, error.stack);
      }
      return false;
    }
  }

  private _isMailAccepted(result: MailerResponseType, recipient: string) {
    return (
      result.messageId !== undefined && result.accepted.includes(recipient) && !result.rejected.includes(recipient)
    );
  }
  }
}
