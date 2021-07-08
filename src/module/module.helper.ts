import { IContainer } from "../api/injection/container.interfaces";
import { IClassProvider, IFactoryProvider } from "../api/injection/provider.interfaces";
import { IDynamicModule, IModule, IModuleHelper, IModuleMetadata } from "../api/module/module.interfaces";
import { DependencyContainer } from "../injection/container";
import { isClassProvider, isFactoryProvider, isValueProvider } from "../injection/util";
import { Class, ProviderType } from "../types";

export class ModuleHelper implements IModuleHelper {

  public createDynamicModule(value: Class<any>): IDynamicModule {
    const metadata: IModuleMetadata = Reflect.getMetadata('module:metadata', value);
    if(metadata === undefined)
      throw new Error(`Couldn't retrieve metadata from module: ${value}`);
    return { moduleClass: value, ...metadata };
  }

  public createModule(dynamicModule: IDynamicModule): IModule {
    return {
      container: new DependencyContainer(),
      module: {
        moduleClass: dynamicModule.moduleClass,
        imports: dynamicModule.imports ?? [],
        controllers: dynamicModule.controllers ?? [],
        providers: dynamicModule.providers ?? [],
        exports: dynamicModule.exports ?? [],
      },
      subModules: []
    };
  }

  public async initializeModule(module: IModule): Promise<void> {
    await this.registerControllers(module.module.controllers, module.container);
    await this.registerProviders(module.module.providers, module.container);
    await this.registerImports(module, module.module.imports, module.container);
  }

  public async registerControllers(controllers: Class<any>[], container: IContainer): Promise<void> {
    for (const controller of controllers)
      container.register(controller).asClassProvider(controller);
  }

  public async registerProviders(providers: ProviderType<any>[], container: IContainer): Promise<void> {
    for (const provider of providers) {
      if(typeof(provider) === 'function')
        return container.register(provider).asClassProvider(provider);
      if(isClassProvider(<any>provider))
        return container.register((<any>provider).key).asClassProvider((<any>provider).class);
      else if(isFactoryProvider(<any>provider))
        return container.register((<any>provider).key).asFactoryProvider((<any>provider).factory);
      else if(isValueProvider(<any>provider))
        return container.register((<any>provider).key).asValueProvider((<any>provider).value);
      throw new Error(`Invalid provider provided: ${(<any>provider).key}`);
    }
  }

  public async registerImports(module: IModule, imports: (Class<any> | IDynamicModule)[], container: IContainer): Promise<void> {
    for (const importedModule of imports) {
      let generatedModule: IModule = typeof(importedModule) === 'function' ? this.createModule(this.createDynamicModule(importedModule)) : this.createModule(importedModule);
      module.subModules.push(generatedModule);
      this.registerProviders(generatedModule.module.exports, container);
      await this.initializeModule(generatedModule);
    }
  }

}