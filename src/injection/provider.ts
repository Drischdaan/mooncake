import { IInjectableMetadata } from "../api/injection/injector.interfaces";
import { IClassProvider, IFactoryProvider, IProvider, IProviderFactory, IValueProvider } from "../api/injection/provider.interfaces";
import { Class, FactoryFunction } from "../types";

export class ProviderFactory implements IProviderFactory {

  constructor(
    protected provider: IProvider,
    protected registry: Array<IProvider>,
  ) {
  }

  public asClassProvider<T>(value: Class<T>): void {
    const metadata: IInjectableMetadata = Reflect.getMetadata('injectable:metadata', value);
      if(metadata === undefined)
        throw new Error(`Couldn't retrieve injectable metadata from provider: ${String(value)}`);
    this.registry.push(<IClassProvider<T>>{ key: this.provider.key, class: value, scope: metadata.scope, scopeInstance: new metadata.scope() });
  }

  public asFactoryProvider<T>(value: FactoryFunction<T>): void {
    this.registry.push(<IFactoryProvider<T>>{ key: this.provider.key, factory: value });
  }

  public asValueProvider<T>(value: T): void {
    this.registry.push(<IValueProvider<T>>{ key: this.provider.key, value: value });
  }

}