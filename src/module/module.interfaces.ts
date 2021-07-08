import { IClassProvider, IFactoryProvider, IProvider, IValueProvider } from "../ioc/ioc.interfaces";
import { Class } from "../types";


export interface IModuleOptions {
  imports?: Class<any>[],
  controllers?: Class<any>[],
  providers?: (Class<any> | IClassProvider<any> | IFactoryProvider<any> | IValueProvider<any>)[],
}

export interface IModule {
  name: string,
  moduleClass: Class<any>,
  options: IModuleOptions,
}

export interface IModuleInitialize {
  onInitialization(): Promise<void>;
}

export const Module = (options: IModuleOptions): ClassDecorator => <TFunction extends Function>(target: TFunction): void => {
  const defaultOptions: IModuleOptions = { imports: [], controllers: [], providers: [] };
  let mergedOptions: IModuleOptions = {};

  Object.assign(mergedOptions, defaultOptions);
  Object.assign(mergedOptions, options);

  Reflect.defineMetadata('module:name', target.name, target);
  Reflect.defineMetadata('module:options', mergedOptions, target);
}