import { injectable } from "tsyringe";
import { Channel, Connection, ConsumeMessage, connect } from "amqplib";
import { INotificationStrategy } from "@domain/interfaces/notification-strategy-interface";
import { NotificationType } from "@domain/types/notification-type";
import { Logger } from "@infrastructure/logging/logger";
import { NotificationChannel } from "@domain/enums";
import { EmailStrategy, PushStrategy, SMSStrategy } from "@application/notification-strategies";
import { Environment } from "@infrastructure/utils";
import { IWorker } from "@application/abstractions/worker/worker-interface";

@injectable()
export class NotificationWorker implements IWorker {
  private _strategy: INotificationStrategy<unknown> | null = null;
  private _connection: Connection | null = null;
  private readonly _exchangeName = process.env.RMQ_EXCHANGE_NAME || "notification_events";
  private readonly _exchangeType = process.env.RMQ_EXCHANGE_TYPE || "direct";
  private readonly _mainQueue = process.env.RMQ_MAIN_QUEUE_NAME || "send_notification_queue";
  private readonly _dlqRoutingKey = process.env.RMQ_DLQ_ROUTING_KEY || "send_notification_dlq";
  private readonly _dlq = process.env.RMQ_DLQ_NAME || "send_notification_dlq";
  private readonly _rmqHostname = process.env.RMQ_HOST || "localhost";
  private readonly _rmqPort = process.env.RMQ_PORT || 5672;

  constructor(
    private readonly _logger: Logger,
    private readonly _emailStrategy: EmailStrategy,
    private readonly _pushStrategy: PushStrategy,
    private readonly _smsStrategy: SMSStrategy
  ) {}

  public setStrategy(strategy: INotificationStrategy<unknown>): void {
    this._strategy = strategy;
  }

  private async _getConnection() {
    if (this._connection === null) {
      this._connection = await connect({
        hostname: this._rmqHostname,
        port: Number(this._rmqPort) ?? 5672,
        username: "guest",
        password: "guest"
      });
    }

    return this._connection;
  }

  public async execute() {
    const connection = await this._getConnection();

    const channel = await connection.createChannel();

    await this._setupQueues(channel);

    channel.prefetch(1);

    channel.consume(
      this._mainQueue,
      async (msg: ConsumeMessage | null) => {
        if (msg === null) return;

        this._logger.logDebug(msg.content.toString());

        try {
          // Sending Notification...
          const notification: NotificationType = JSON.parse(msg.content.toString());

          this._strategy = this._selectStrategy(notification);
          const result = await this._strategy.send(notification.data);

          if (!result.success) {
            this._publishToDLQ(channel, msg);
          }

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
      this._logger.logInfo("Received SIGTERM! Notification worker shutting down gracefully.");
      await channel.close();
      await connection.close();
    });
  }

  private async _setupQueues(channel: Channel) {
    // Declare exchange and queues with the DLQ
    await channel.assertExchange(this._exchangeName, this._exchangeType, { durable: true });
    await channel.assertQueue(this._mainQueue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": this._exchangeName,
        "x-dead-letter-routing-key": this._dlqRoutingKey // Send to DLQ when rejected
      }
    });

    // Declare the DLQ itself
    await channel.assertQueue(this._dlq, { durable: true });
  }

  private async _publishToDLQ(channel: Channel, msg: ConsumeMessage) {
    const notification = msg.content.toString();
    this._logger.logDebug(`Publishing message to DLQ: ${notification}`);

    // Publish the failed message to the DLQ
    channel.publish(this._exchangeName, this._dlqRoutingKey, Buffer.from(notification), {
      persistent: Environment.isProduction
    });
  }

  private _selectStrategy(notification: NotificationType) {
    let strategy: INotificationStrategy<unknown> | null = null;

    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        strategy = this._emailStrategy;
        break;
      case NotificationChannel.PUSH:
        strategy = this._pushStrategy;
        break;
      case NotificationChannel.SMS:
        strategy = this._smsStrategy;
        break;
      default:
        throw new Error("Unsupported notification channel");
    }

    this._logger.logDebug(`Selected ${strategy} strategy for ${notification.channel} notification.`);

    return strategy;
  }
}
