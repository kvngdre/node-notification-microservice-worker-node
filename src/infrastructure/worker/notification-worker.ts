import { injectable } from "tsyringe";
import { ConsumeMessage, connect } from "amqplib";
import { IWorker } from "@application/abstractions/worker-interface";
import { INotificationStrategy } from "@domain/interfaces/notification-strategy-interface";
import { NotificationType } from "@domain/types/notification-type";
import { Logger } from "@infrastructure/logging/logger";
import { NotificationChannel } from "@domain/enums";
import { EmailStrategy, PushStrategy, SMSStrategy } from "@domain/notification-strategies";

@injectable()
export class NotificationWorker implements IWorker {
  private _strategy: INotificationStrategy<unknown>;

  constructor(
    private readonly _logger: Logger,
    private readonly _emailStrategy: EmailStrategy,
    private readonly _pushStrategy: PushStrategy,
    private readonly _smsStrategy: SMSStrategy
  ) {}

  public setStrategy(strategy: INotificationStrategy<unknown>): void {
    this._strategy = strategy;
  }

  public async execute() {
    const queue = "send_notification_queue";

    const connection = await connect({
      hostname: process.env.RMQ_HOST,
      port: Number(process.env.RMQ_PORT) ?? 5672,
      username: "guest",
      password: "guest"
    });

    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

    channel.consume(
      queue,
      async (msg: ConsumeMessage | null) => {
        if (msg === null) return;

        this._logger.logDebug(msg.content.toString());

        try {
          // Sending Notification...
          const notification: NotificationType = JSON.parse(msg.content.toString());
          // await this._sendNotification(notification);
          this._selectStrategy(notification);
          await this._strategy.send(notification);

          channel.ack(msg);
        } catch (error) {
          if (error instanceof Error) {
            this._logger.logError(
              `Failed to process message ${msg.content.toString()}. Reason -> ${error.message}`,
              error.stack
            );
          }

          channel.nack(msg, false, false); // Do not requeue
        }
      },
      { noAck: false }
    );

    process.on("SIGTERM", async () => {
      this._logger.logInfo("Received SIGTERM, shutting down gracefully");
      await channel.close();
      await connection.close();
    });
  }

  private _selectStrategy(notification: NotificationType) {
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        this._strategy = this._emailStrategy;
        break;
      case NotificationChannel.PUSH:
        this._strategy = this._pushStrategy;
        break;
      case NotificationChannel.SMS:
        this._strategy = this._smsStrategy;
        break;
      default:
        throw new Error("Unsupported notification channel");
    }

    this._logger.logDebug(`Selected ${notification.channel} strategy for notification`);
  }

  // private async _sendNotification(notification: Notification): Promise<boolean> {
  //   const channel = notification.channel;
  //   const data = JSON.parse(notification.data as unknown as string);

  //   switch (channel) {
  //     case NotificationChannel.EMAIL:
  //       return await this._emailChannel.send(data);
  //     case NotificationChannel.SMS:
  //       return await this._smsChannel.send(data);
  //     case NotificationChannel.PUSH:
  //       return await this._pushChannel.send(data);
  //     default:
  //       throw new Error(`Unsupported channel: "${channel}"`);
  //   }
  // }
}
