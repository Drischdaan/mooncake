import { TransientScope } from "..";
import { Class } from "../types";
import { IClassProvider, IContainer, IContainerEntry, IFactoryProvider, IProvider, IScope, IValueProvider } from "./ioc.interfaces";
import { isClassProvider, isFactoryProvider, isValueProvider } from "./util";

export class ContainerEntry<T> implements IContainerEntry<T> {

  public provider: IProvider<T>;

  constructor(
    public key: string,
  ) {}

  public asClassProvider(value: Class<T>, scope: IScope = new TransientScope()): void {
    this.provider = <IClassProvider<T>>{
      key: this.key,
      class: value,
      scope: scope,
    };
  }

  public asFactoryProvider(value: Function): void {
    this.provider = <IFactoryProvider<T>>{
      key: this.key,
      factory: value
    };
  }

  public asValueProvider(value: T): void {
    this.provider = <IValueProvider<T>>{
      key: this.key,
      value: value
    };
  }

}

export class IocContainer implements IContainer {

  private readonly entries: IContainerEntry<any>[];

  constructor() {
    this.entries = new Array<IContainerEntry<any>>();
  }

  public register<T>(key: Class<T> | string): IContainerEntry<T> {
    const generatedKey: string = this.generateKey(key);
    const entries: IContainerEntry<any>[] = this.entries.filter((entry: IContainerEntry<any>) => entry.provider.key === generatedKey);
    if(entries.length !== 0)
      throw new Error(`There is already an entry with that key!`);
    let entry: IContainerEntry<T> = new ContainerEntry<T>(generatedKey);
    this.entries.push(entry);
    return entry;
  }

  public resolve<T>(key: string | Class<T>): T {
    const generatedKey: string = this.generateKey(key);
    const entry: IContainerEntry<any> = this.entries.find((entry: IContainerEntry<any>) => entry.provider.key === generatedKey);
    if(entry === undefined)
      throw new Error(`There is no entry with that key: ${key}`);
    if(isClassProvider(entry.provider))
      return (<IClassProvider<T>>entry.provider).scope.resolve<T>((<IClassProvider<T>>entry.provider), this);
    else if(isFactoryProvider(entry.provider))
      return (<IFactoryProvider<T>>entry.provider).factory();
    else if(isValueProvider(entry.provider))
      return (<IValueProvider<T>>entry.provider).value;
    else
      throw new Error(`Invalid provider detected with key "${entry.provider.key}"`);
  }

  public generateKey(key: any): string {
    if(typeof(key) === 'string')
      return key;
    const name: string = Reflect.getMetadata('injectable:name', key);
    if(name === undefined)
      return key.name;
    return name;
  }

}