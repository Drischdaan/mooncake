import { Class, ProviderType } from "../../types";
import { IContainer } from "../injection/container.interfaces";

export interface IModuleMetadata {
  imports?: (Class<any> | IDynamicModule)[];
  controllers?: Class<any>[];
  providers?: ProviderType<any>[];
  exports?: ProviderType<any>[];
}

export interface IDynamicModule extends IModuleMetadata {
  moduleClass: Class<any>;
  global?: boolean;
}

export interface IModule {
  container: IContainer;
  module: IDynamicModule;
  subModules: IModule[];
}

export interface IModuleHelper {
  createDynamicModule(value: Class<any>): IDynamicModule;
  createModule(dynamicModule: IDynamicModule): IModule;
  initializeModule(module: IModule): Promise<void>;
}