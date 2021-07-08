import { Class, FactoryFunction } from "../../types";
import { IScope } from "./scope.interfaces";

export interface IProvider {
  key: string;
}

export interface IClassProvider<T> extends IProvider {
  class: Class<T>;
  scope: Class<IScope>;
  scopeInstance: IScope;
}

export interface IFactoryProvider<T> extends IProvider {
  factory: FactoryFunction<T>;
}

export interface IValueProvider<T> extends IProvider {
  value: T;
}

export interface IProviderFactory {
  asClassProvider<T>(value: Class<T>): void;
  asFactoryProvider<T>(value: FactoryFunction<T>): void;
  asValueProvider<T>(value: T): void;
}