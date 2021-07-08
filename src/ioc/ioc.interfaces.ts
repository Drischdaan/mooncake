import { Class } from "../types";
import { TransientScope } from "./scopes";
import { makeTargetInjectable } from "./util";

export interface IScope {
  resolve<T>(provider: IClassProvider<T>, container: IContainer): T;
}

export interface IProvider<T> {
  key: string,
}

export interface IFactoryProvider<T> extends IProvider<T> {
  factory: Function,
}

export interface IClassProvider<T> extends IProvider<T> {
  class: Class<T>,
  scope: IScope,
}

export interface IValueProvider<T> extends IProvider<T> {
  value: T,
}

export interface IContainerEntry<T> {
  provider: IProvider<T>;
  asClassProvider(value: Class<T>, scope?: IScope): void;
  asFactoryProvider(factory: Function): void;
  asValueProvider(value: T): void;
}

export interface IContainer {
  register<T>(key: Class<T> | string): IContainerEntry<T>;
  resolve<T>(key: Class<T> | string): T;
  generateKey(key: any): string;
}

export const Injectable = (name?: string, scope: Class<IScope> = TransientScope): ClassDecorator => <TFunction extends Function>(target: TFunction): void => {
  makeTargetInjectable(target, name, scope);
}

export const Inject = (name: string): ParameterDecorator => (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
  const keys: any = Reflect.getMetadata('injection:keys', target) ?? [];
  keys.push({ key: name, index: parameterIndex });
  Reflect.defineMetadata('injection:keys', keys, target);
}