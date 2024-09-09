import { container } from "tsyringe";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { ILogger } from "@application/abstractions/logging";

export function registerServices() {
  registerInfrastructureServices();

  container.resolve<ILogger>("Logger").logDebug("Service registration complete...✅");
}
