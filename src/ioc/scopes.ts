import { IClassProvider, IContainer, IProvider, IScope } from "./ioc.interfaces";

export class SingletonScope implements IScope {

  private instance: any;

  public resolve<T>(provider: IClassProvider<T>, container: IContainer): T {
    if(this.instance !== undefined)
      return this.instance;
    const parameterTypes: any[] = Reflect.getMetadata('design:paramtypes', provider.class) ?? [];
    const injectionKeys: any[] = Reflect.getMetadata('injection:keys', provider.class) ?? [];
    const resolvedParameters: any[] = [];
    parameterTypes.forEach((parameter: any, index: number) => {
      const key: string = injectionKeys.find((value: any) => value.index === index)?.key;
      const resolved: any = container.resolve(key ?? parameter);
      if(resolved === undefined)
        throw new Error(`Couldn't resolve parameter "${parameter}"!`);
      resolvedParameters.push(resolved);
    });
    this.instance = new provider.class(...resolvedParameters);
    return this.instance;
  }

}

export class TransientScope implements IScope {

  public resolve<T>(provider: IClassProvider<T>, container: IContainer): T {
    const parameterTypes: any[] = Reflect.getMetadata('design:paramtypes', provider.class) ?? [];
    const injectionKeys: any[] = Reflect.getMetadata('injection:keys', provider.class) ?? [];
    const resolvedParameters: any[] = [];
    parameterTypes.forEach((parameter: any, index: number) => {
      const key: string = injectionKeys.find((value: any) => value.index === index)?.key;
      const resolved: any = container.resolve(key ?? parameter);
      if(resolved === undefined)
        throw new Error(`Couldn't resolve parameter "${parameter}"!`);
      resolvedParameters.push(resolved);
    });
    return new provider.class(...resolvedParameters);
  }

}