import { Class, ProviderKey } from "../../types";
import { IScope } from "./scope.interfaces";

export interface IInjectionKey {
  key: ProviderKey<any>;
  parameterIndex: number;
}

export interface IInjectableMetadata {
  name: string;
  scope: Class<IScope>;
  parameterKeys: string[];
}

export interface IInjector {
  createInstance<T>(value: Class<T>, ...args: any[]): T;
  generateKey(value: ProviderKey<any>): string;
}