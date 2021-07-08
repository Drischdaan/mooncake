export interface IApplication {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
}