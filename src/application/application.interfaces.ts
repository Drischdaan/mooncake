import { IContainer } from "../ioc/ioc.interfaces";
import { ILogger } from "../util/logger.interfaces";

export interface IApplicationOptions {
  name: string;
}

export interface IApplication {
  onInitialization(): Promise<void>;
  onStart(): Promise<void>;
  onStop(): Promise<void>;
}