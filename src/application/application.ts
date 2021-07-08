import { IocContainer } from "../ioc/container";
import { IClassProvider, IContainer, IFactoryProvider, IProvider, IScope, IValueProvider } from "../ioc/ioc.interfaces";
import { isClassProvider, isFactoryProvider, isValueProvider } from "../ioc/util";
import { IModule, IModuleOptions } from "../module/module.interfaces";
import { Class } from "../types";
import { ILogger } from "../util/logger.interfaces";
import { BasicLogger } from "../util/basic.logger";
import { IApplication, IApplicationOptions } from "./application.interfaces";

export abstract class Application implements IApplication {

  protected readonly container: IContainer;
  protected readonly logger: ILogger;
  private readonly internalLogger: ILogger;

  protected readonly controllers: Class<any>[];
  protected readonly providers: (Class<any> | IProvider<any>)[];

  constructor(
    protected readonly mainModule: IModule,
    protected readonly options: IApplicationOptions,
  ) {
    this.container = new IocContainer();
    this.logger = new BasicLogger(options.name);
    this.internalLogger = new BasicLogger('Bootstrap');
    this.controllers= [];
    this.providers = [];
  }

  public async onInitialization(): Promise<void> {
    this.internalLogger.info('Initializing', this.options.name, '...');
    this.internalLogger.info('Preparing container providers...');
    await this.registerModule(this.mainModule);
  }

  public async onStart(): Promise<void> {

  }

  public async onStop(): Promise<void> {

  }

  private async registerModule(module: IModule): Promise<void> {
    await this.registerProviders(module);
    await this.registerControllers(module);
    await this.registerImports(module);
  }

  private async registerProviders(module: IModule): Promise<void> {
    for(const provider of module.options.providers) {
      if(isClassProvider(<any>provider)) {
        const classProvider: IClassProvider<any> = <IClassProvider<any>>provider;
        this.container.register(classProvider.key).asClassProvider(classProvider.class, classProvider.scope);
      } else if(isFactoryProvider(<any>provider)) {
        const factoryProvider: IFactoryProvider<any> = <IFactoryProvider<any>>provider;
        this.container.register(factoryProvider.key).asFactoryProvider(factoryProvider.factory);
      } else if(isValueProvider(<any>provider)) {
        const valueProvider: IValueProvider<any> = <IValueProvider<any>>provider;
        this.container.register(valueProvider.key).asValueProvider(valueProvider.value);
      } else {
        const providerName: string = Reflect.getMetadata('injectable:name', provider);
        const providerScope: Class<IScope> = Reflect.getMetadata('injectable:scope', provider);
        if(providerName === undefined || providerScope === undefined)
          throw new Error(`Invalid provider found: ${provider}`);
          this.providers.push(provider);
        this.container.register(<Class<any>>provider).asClassProvider(<Class<any>>provider, new providerScope());
      }
    }
  }

  private async registerControllers(module: IModule): Promise<void> {
    for(const controller of module.options.controllers) {
      const controllerName: string = Reflect.getMetadata('injectable:name', controller);
      const controllerScope: Class<IScope> = Reflect.getMetadata('injectable:scope', controller);
      if(controllerName === undefined || controllerScope === undefined)
        throw new Error(`Invalid controller found: ${controller}`);
      this.controllers.push(controller);
      this.container.register(controllerName).asClassProvider(controller, new controllerScope());
    }
  }

  private async registerImports(module: IModule): Promise<void> {
    for(const importedModule of module.options.imports) {
      const moduleName: string = Reflect.getMetadata('module:name', importedModule)
      const moduleOptions: IModuleOptions = Reflect.getMetadata('module:options', importedModule);
      if(moduleName === undefined || moduleOptions === undefined)
        throw new Error(`Invalid imported module found: ${importedModule}`);
      const instance: any = new importedModule();
      if('onInitialization' in instance)
        await instance['onInitialization']();
      const generatedModule: IModule = { name: moduleName, moduleClass: importedModule, options: moduleOptions };
      await this.registerModule(generatedModule);
    }
  }

}