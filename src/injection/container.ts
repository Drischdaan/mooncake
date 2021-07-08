import { IContainer } from "../api/injection/container.interfaces";
import { IInjector } from "../api/injection/injector.interfaces";
import { IClassProvider, IFactoryProvider, IProvider, IProviderFactory, IValueProvider } from "../api/injection/provider.interfaces";
import { ProviderKey } from "../types";
import { Injector } from "./injector";
import { ProviderFactory } from "./provider";
import { isClassProvider, isFactoryProvider, isValueProvider } from "./util";

export class DependencyContainer implements IContainer {

  protected readonly providerRegistry: IProvider[];
  protected readonly injector: IInjector;

  constructor() {
    this.providerRegistry = new Array<IProvider>();
    this.injector = new Injector();
  }

  public register<T>(key: ProviderKey<T>): IProviderFactory {
    const generatedKey: string = this.injector.generateKey(key);
    if(generatedKey === undefined)
      throw new Error(`Couldn't generate key for '${String(key)}'`);
    let provider: IProvider = this.providerRegistry.find((value: IProvider) => value.key === key);
    if(provider !== undefined)
      throw new Error(`There is already a provider with that key registered!`);
    provider = { key: generatedKey };
    return new ProviderFactory(provider, this.providerRegistry);
  }

  public resolve<T>(key: ProviderKey<T>): T {
    const provider: IProvider = this.getProvider<T>(key);
    if(provider === undefined)
      throw new Error(`There is no provider registered with that key: ${String(key)}`);
    if(isClassProvider(provider))
      return (<IClassProvider<T>>provider).scopeInstance.resolve<T>((<IClassProvider<T>>provider), this);
    else if(isFactoryProvider(provider))
      return (<IFactoryProvider<T>>provider).factory();
    else if(isValueProvider(provider))
      return (<IValueProvider<T>>provider).value;
    throw new Error(`Invalid provider provided: ${provider.key}`);
  }

  public getProvider<T>(key: ProviderKey<T>): IProvider {
    const generatedKey: string = this.injector.generateKey(key);
    if(generatedKey === undefined)
      throw new Error(`Couldn't generate key for '${String(key)}'`);
    return this.providerRegistry.find((value: IProvider) => value.key === generatedKey);
  }

}