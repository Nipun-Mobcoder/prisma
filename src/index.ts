import App from "./app";
import "dotenv/config";
import { logger } from "./utils/logging";

class AppBootstrapper {
  private app: App;
  private port: number;

  constructor() {
    this.app = new App();
    this.port = (process.env.PORT as unknown as number) || 4000;
  }

  public async start(): Promise<void> {
    try {
      this.app.listen(this.port);
    } catch (error: any) {
      logger.error("Application startup failed: ", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

process.on("uncaughtException", error => {
  logger.error("Uncaught Exception: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection: ", reason);
});

const bootstrapper = new AppBootstrapper();
bootstrapper.start();
