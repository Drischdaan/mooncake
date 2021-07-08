import { IContainer } from "../api/injection/container.interfaces";
import { IInjectableMetadata, IInjector } from "../api/injection/injector.interfaces";
import { IClassProvider, IProvider } from "../api/injection/provider.interfaces";
import { IScope } from "../api/injection/scope.interfaces";
import { Injector } from "./injector";

export class TransientScope implements IScope {

  private readonly injector: IInjector;

  constructor() {
    this.injector = new Injector();
  }

  public resolve<T>(provider: IClassProvider<T>, container: IContainer): T {
    const metadata: IInjectableMetadata = Reflect.getMetadata('injectable:metadata', provider.class);
    if(metadata === undefined)
      throw new Error(`Couldn't retrieve injectable metadata from provider: ${provider.key}`);
    const args: any[] = [];
    metadata.parameterKeys.forEach((value: string) => args.push(container.resolve(value)));
    return this.injector.createInstance(provider.class, ...args);
  }

}

export class SingletonScope implements IScope {

  private providerInstance: any;
  private readonly injector: IInjector;

  constructor() {
    this.injector = new Injector();
  }

  public resolve<T>(provider: IClassProvider<T>, container: IContainer): T {
    if(this.providerInstance !== undefined)
      return this.providerInstance;
    const metadata: IInjectableMetadata = Reflect.getMetadata('injectable:metadata', provider.class);
    if(metadata === undefined)
      throw new Error(`Couldn't retrieve injectable metadata from provider: ${provider.key}`);
    const args: any[] = [];
    metadata.parameterKeys.forEach((value: string) => args.push(container.resolve(value)));
    this.providerInstance = this.injector.createInstance(provider.class, args);
    return this.providerInstance;
  }

}