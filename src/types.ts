export type Class<T> = { new(...args: any[]): T; };
export interface Type<T> extends Function {
  new (...args: any[]): T;
}