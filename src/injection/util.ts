import { IProvider } from "../api/injection/provider.interfaces";

export function isClassProvider(provider: IProvider): boolean {
  return (<any>provider).class !== undefined && (<any>provider).scope !== undefined && (<any>provider).scopeInstance !== undefined;
}

export function isFactoryProvider(provider: IProvider): boolean {
  return (<any>provider).factory !== undefined;
}

export function isValueProvider(provider: IProvider): boolean {
  return (<any>provider).value !== undefined;
}