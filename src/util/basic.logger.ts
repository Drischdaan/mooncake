import { Logger } from "tslog";
import { ILogger } from "./logger.interfaces";

export class BasicLogger implements ILogger {

  private logger: Logger;

  constructor(name: string) {
    this.logger = new Logger({ name: name });
  }

  public info(message: string, ...args: string[]): void {
    this.logger.info(message, ...args);
  }
  public error(message: string, ...args: string[]): void {
    this.logger.error(message, ...args);
  }
  public warn(message: string, ...args: string[]): void {
    this.logger.warn(message, ...args);
  }

}