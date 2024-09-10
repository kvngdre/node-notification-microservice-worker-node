declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RMQ_HOST: string;
      RMQ_PORT: string;
      RMQ_EXCHANGE_NAME: string;
      RMQ_EXCHANGE_TYPE: string;
      RMQ_MAIN_QUEUE_ROUTING_KEY: string;
      RMQ_MAIN_QUEUE_NAME: string;
      RMQ_DLQ_ROUTING_KEY: string;
      RMQ_DLQ_NAME: string;
      EMAIL_HOST: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_API_KEY: string;
      EMAIL_DOMAIN: string;
      FRB_TYPE: string;
      FRB_PROJECT_ID: string;
      FRB_PRIVATE_KEY_ID: string;
      FRB_PRIVATE_KEY: string;
      FRB_CLIENT_EMAIL: string;
      FRB_CLIENT_ID: string;
      FRB_AUTH_URI: string;
      FRB_TOKEN_URI: string;
      FRB_AUTH_PROVIDER_X509_CERT_URL: string;
      FRB_CLIENT_X509_CERT_URL: string;
      FRB_UNIVERSAL_DOMAIN: string;
    }
  }
}

export {}
