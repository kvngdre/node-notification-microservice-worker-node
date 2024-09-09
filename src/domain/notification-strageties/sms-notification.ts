export class SMSNotification {
  constructor(
    public readonly to: string,
    public readonly body: string
  ) {}
}
