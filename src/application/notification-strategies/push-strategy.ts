import { inject, singleton } from "tsyringe";
import { initializeApp, cert, App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { INotificationResult, IPushNotificationData } from "@domain/interfaces";
import { INotificationStrategy } from "@domain/interfaces/notification-strategy-interface";
import { ILogger } from "@application/abstractions/logging";

@singleton()
export class PushStrategy implements INotificationStrategy<IPushNotificationData> {
  private readonly _app: App;
  private readonly _type?: string = process.env.FRB_TYPE;
  private readonly _project_id?: string = process.env.FRB_PROJECT_ID;
  private readonly _private_key_id?: string = process.env.FRB_PRIVATE_KEY_ID;
  private readonly _private_key?: string = process.env.FRB_PRIVATE_KEY;
  private readonly _client_email?: string = process.env.FRB_CLIENT_EMAIL;
  private readonly _client_id?: string = process.env.FRB_CLIENT_ID;
  private readonly _auth_uri?: string = process.env.FRB_AUTH_URI;
  private readonly _token_uri?: string = process.env.FRB_TOKEN_URI;
  private readonly _auth_provider_x509_cert_url?: string = process.env.FRB_AUTH_PROVIDER_X509_CERT_URL;
  private readonly _client_x509_cert_url?: string = process.env.FRB_CLIENT_X509_CERT_URL;
  private readonly _universe_domain?: string = process.env.FRB_UNIVERSAL_DOMAIN;

  constructor(@inject("Logger") private readonly _logger: ILogger) {
    this._app = initializeApp({
      credential: cert({
        //@ts-expect-error No overload for an object of this type
        type: this._type,
        project_id: this._project_id,
        private_key_id: this._private_key_id,
        private_key: this._private_key,
        client_email: this._client_email,
        client_id: this._client_id,
        auth_uri: this._auth_uri,
        token_uri: this._token_uri,
        auth_provider_x509_cert_url: this._auth_provider_x509_cert_url,
        client_x509_cert_url: this._client_x509_cert_url,
        universe_domain: this._universe_domain
      }),
      projectId: process.env.FRB_PROJECT_ID
    });
  }

  public async send(data: IPushNotificationData): Promise<INotificationResult> {
    try {
      const message = {
        notification: {
          title: data.title,
          body: data.body,
          imageUrl: data.imageUrl
        },
        token: data.deviceToken
      };

      const response = await getMessaging(this._app).send(message);

      /**
       * response comes in the form: "projects/{project_id}/messages/{message_id}"
       * Splitting and checking for the existence of the message_id.
       */
      const parts = response.split("messages/");

      // Safer to check for the length than to do an index access( !!part[1] ) on the array.
      if (parts.length >= 2) {
        const messageId: string = parts[1];
        return {
          success: true,
          messageId: messageId
        };
      }

      return {
        success: false
      };
    } catch (error) {
      if (error instanceof Error) {
        this._logger.logError(`Failed to push notification. Reason -> ${error.message}`, error.stack);
      }

      const e = error as Error;
      return {
        errorMessage: e.message,
        success: false
      };
    }
  }
}
