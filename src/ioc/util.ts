import { Class } from "../types";
import { IProvider, IScope } from "./ioc.interfaces";

export function makeTargetInjectable(target: any, name: string, scope: Class<IScope>) {
  Reflect.defineMetadata('injectable:name', name ?? target.name, target);
  Reflect.defineMetadata('injectable:scope', scope, target);
}

export function isClassProvider<T>(provider: IProvider<T>): boolean {
  return (<any>provider).class !== undefined && (<any>provider).scope !== undefined;
}

export function isFactoryProvider<T>(provider: IProvider<T>): boolean {
  return (<any>provider).factory !== undefined;
}

export function isValueProvider<T>(provider: IProvider<T>): boolean {
  return (<any>provider).value !== undefined;
}