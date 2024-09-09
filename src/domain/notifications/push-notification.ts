export class PushNotification {
  constructor(
    public readonly deviceToken: string,
    public readonly title: string,
    public readonly body: string,
    public readonly imageUri?: string
  ) {}
}
