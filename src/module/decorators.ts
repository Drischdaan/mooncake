import { IModuleMetadata } from "../api/module/module.interfaces";

export const Module: (options: IModuleMetadata) => ClassDecorator = (options?: IModuleMetadata): ClassDecorator => <TFunction extends Function>(target: TFunction): void => {
  Reflect.defineMetadata('module:metadata', <IModuleMetadata>{
    imports: options.imports ?? [],
    controllers: options.controllers ?? [],
    providers: options.providers ?? [],
    exports: options.exports ?? [],
  }, target);
};