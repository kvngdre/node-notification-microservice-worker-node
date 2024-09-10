import { inject, injectable } from "tsyringe";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";
import { INotificationStrategy } from "@domain/interfaces/notification-strategy-interface";
import { ILogger } from "@application/abstractions/logging";
import { IEmailNotification, INotificationResult } from "@domain/interfaces";

@injectable()
export class EmailStrategy implements INotificationStrategy<IEmailNotification> {
  private readonly _transport;
  private readonly _emailUser = process.env.MAILGUN_USERNAME;
  private readonly _emailPassword = process.env.MAILGUN_PASSWORD;
  private readonly _emailHost = process.env.MAILGUN_HOST;

  constructor(@inject("Logger") private readonly _logger: ILogger) {
    this._transport = createTransport({
      auth: {
        user: this._emailUser,
        pass: this._emailPassword
      },
      port: 465, // True for 465, false for other ports
      secure: true,
      host: this._emailHost
    });
  }

  public async send(notification: IEmailNotification): Promise<INotificationResult> {
    const mailOptions: Mail.Options = {
      from: `${notification.data.alias}<no-reply@pulse-core.xyz>`,
      to: notification.data.to,
      subject: notification.data.subject,
      html: notification.data.body
    };

    try {
      const result: MailerResponseType = (await this._transport.sendMail(mailOptions)) as MailerResponseType;
      console.log(result);

      const isAccepted = this._isMailAccepted(result, notification.data.to);

      return {
        messageId: result.messageId,
        errorMessage: isAccepted ? undefined : result.message,
        success: isAccepted
      };
    } catch (error) {
      if (error instanceof Error) {
        this._logger.logError(`Failed to email notification. Reason -> ${error.message}`, error.stack);

        return {
          errorMessage: error.message,
          success: false
        };
      }

      const e = error as Error;
      return {
        errorMessage: e.message,
        success: false
      };
    }
  }

  private _isMailAccepted(result: MailerResponseType, recipient: string) {
    return (
      result.messageId !== undefined && result.accepted.includes(recipient) && !result.rejected.includes(recipient)
    );
  }
}

type MailerResponseType = SentMessageInfo & {
  status: number;
  message: string;
};
