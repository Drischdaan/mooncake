import { IInjectableMetadata, IInjectionKey, IInjector } from "../api/injection/injector.interfaces";
import { IScope } from "../api/injection/scope.interfaces";
import { Class, ProviderKey } from "../types";
import { Injector } from "./injector";
import { TransientScope } from "./scopes";

export const Inject = (key: ProviderKey<any>): ParameterDecorator => (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
  const injectionKeys: IInjectionKey[] = Reflect.getMetadata('injection:keys', target) ?? [];
  injectionKeys.push({ key: key, parameterIndex: parameterIndex });
  Reflect.defineMetadata('injection:keys', injectionKeys, target);
};

export const Injectable = (name?: string, scope: Class<IScope> = TransientScope): ClassDecorator => <TFunction extends Function>(target: TFunction): void => {
  makeTargetInjectable(target, { name: name ?? target.name, scope: scope, parameterKeys: [] });
};

export function makeTargetInjectable(target: any, metadata: IInjectableMetadata): void {
  const injector: IInjector = new Injector();
  const keys: IInjectionKey[] = Reflect.getMetadata('injection:keys', target) ?? [];
  const parameterTypes: any[] = Reflect.getMetadata('design:paramtypes', target)?? [];
  const parameterKeys: string[] = [];
  parameterTypes.forEach((value: any, index: number) => {
    let key: ProviderKey<any> = keys.find((value: IInjectionKey) => value.parameterIndex === index)?.key;
    parameterKeys.push(injector.generateKey(key ?? value));
  });
  metadata.parameterKeys = parameterKeys;
  Reflect.defineMetadata('injectable:metadata', metadata, target);
}