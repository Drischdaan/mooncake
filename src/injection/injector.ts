import { IInjectableMetadata, IInjector } from "../api/injection/injector.interfaces";
import { Class, ProviderKey } from "../types";

export class Injector implements IInjector {

  public createInstance<T>(value: Class<T>, ...args: any[]): T {
    if(value === undefined)
      throw new Error(`Invalid class provided!`);
    return new value(...args);
  }

  public generateKey(value: ProviderKey<any>): string {
    if(typeof(value) === "string")
      return value;
    else if(typeof(value) === "symbol")
      return value.toString().replace('Symbol(', '').replace(')', '');
    else if(typeof(value) === "function") {
      const metadata: IInjectableMetadata = Reflect.getMetadata('injectable:metadata', value);
      if(metadata === undefined)
        throw new Error(`Couldn't retrieve injectable metadata from provider: ${String(value)}`);
      return metadata.name;
    }
    return undefined;
  }

}