# Node Notification Worker Node

## Overview

The Node Notification Worker Node is an advanced, scalable notification delivery system built to handle various communication channels, including Email, SMS, and Push notifications. It integrates easily into distributed systems and ensures reliability and fault tolerance through a Dead Letter Queue (DLQ) mechanism for failed notifications, making it a robust solution for large-scale notification delivery.

## Features

- **Multi-Channel Support**: Seamlessly handle notifications across multiple communication channels, ensuring messages are delivered through the user’s preferred medium.
- **Decoupled Architecture**: Each notification type is handled via the [**Strategy Pattern**](https://learn.microsoft.com/en-us/shows/Visual-Studio-Toolbox/Design-Patterns-Strategy), making it easy to extend and maintain. This architecture promotes flexibility and scalability across different services.
- **Dead Letter Queue (DLQ) for Failed Notifications**: In case of failures, messages are routed to a DLQ, where they can be retried or handled for failure processing. This guarantees message reliability and allows for efficient error handling and reprocessing.
- **High Scalability**: Easily scale the system by spinning up additional worker nodes for high-throughput environments. The distributed nature ensures smooth operation under heavy load.
- **Dependency Injection**: Built using Inversion of Control (IoC) principles to promote testability, flexibility, and maintainability through libraries like tsyringe.
- **Microservice-Ready**: Designed for microservice architectures, this worker node integrates with RabbitMQ for message handling and is easily deployable in cloud or containerized environments.

## Getting Started

### Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/en/download/package-manager) (version 20.0.0 or later)
- [RabbitMQ](https://www.rabbitmq.com/) (for message brokering)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerization)

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/kvngdre/node-notification-worker-node.git
   cd node-notification-worker-node
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

### Configuration

1. **Set up environment variables**: Create a `.env` file in the root directory and configure the necessary environment variables. Example:

   ```text
   # EMAIL
   EMAIL_HOST=localhost
   EMAIL_USERNAME=user
   ```

### Running the Service

You have two options to run the service:

#### Option 1: Using Docker Compose

Docker Compose simplifies the process of running the microservice along with its dependencies.

We can run the notification-microservice-worker-node in a separate Docker container while still using the same RabbitMQ container from the [notification-microservice](https://github.com/kvngdre/node-notification-microservice) setup. To achieve this, we are going to use Docker's networking capabilities to ensure that the worker service can communicate with the RabbitMQ container from another Compose setup.

Here’s how you can do it:

1. Ensure Docker and Docker Compose are installed.

2. Use a shared Docker network then make both the notification-microservice and the notification-microservice-worker-node use this shared network. This allows both services to communicate with RabbitMQ regardless of which Compose file they are in.

3. Create a network that both services can use:

   ```sh
   docker network create notification-network
   ```

4. Navigate to the project directory:

   ```sh
   cd path/to/your/notification-microservice-repository
   ```

5. Start the Notification Microservice using Docker Compose:

   ```sh
   docker-compose -f docker-compose.notification-ms.yml up -d
   ```

6. Start the Notification Worker in a separate terminal:

   ```sh
   docker-compose -f docker-compose.worker.yml up -d
   ```

7. Stop the services:

   ```sh
   docker-compose down
   ```

#### Option 2: Manual Setup

If you prefer to run the service manually or do not use Docker Compose, follow these steps:

1. Start RabbitMQ if not already started by the notification microservice:

   ```sh
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

2. Start the worker service:

   ```sh
   npm start
   ```

## Feature Requests

I welcome and encourage feature requests to help improve the Notification Microservice. To submit a feature request, please follow these steps:

1. Go to the [issues page](https://github.com/kvngdre/node-notification-microservice/issues) of this repository.
2. **Check Existing Issues**: Before submitting a new feature request, please check if your idea has already been proposed or discussed. You can use the search bar to find related issues.
3. Submit a New Issue: If your feature request is not already listed, click on the "New issue" button to create a new issue.
4. Provide Details:

   - Title: Write a clear and concise title for your feature request.
   - Description: Describe the feature you are requesting in detail. Include information such as:
     - Use Case: Why do you think this feature is necessary? What problem does it solve?
     - Proposed Solution: How do you envision the feature working? What specific functionality should it include?
     - Additional Context: Provide any additional information or context that might help in understanding the feature request.

5. Submit: Click "Submit new issue" to create your feature request.

I appreciate your contributions and will review your request as soon as possible.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/[feature_name]`).
3. Commit your changes (`git commit -am "Add new [feature_name] feature"`).
4. Push to the branch (`git push origin feature/[feature_name]`).
5. Create a new pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE.md) file for details
