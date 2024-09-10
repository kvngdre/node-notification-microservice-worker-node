import { container } from "tsyringe";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { ILogger } from "@application/abstractions/logging";
import { registerApplicationServices } from "@application/application-dependency-injection";

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();

  container.resolve<ILogger>("Logger").logDebug("Service registration complete...✅");
}
