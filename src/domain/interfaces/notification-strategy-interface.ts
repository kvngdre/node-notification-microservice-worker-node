"notification-strategy-interface.ts";

import { INotificationResult } from "./notification-result-interface";

export interface INotificationStrategy<T> {
  send(notification: T): Promise<INotificationResult>;
}
