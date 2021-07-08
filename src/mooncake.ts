import { IApplication, IApplicationOptions } from "./application/application.interfaces";
import { IModule, IModuleOptions } from "./module/module.interfaces";
import { Class } from './types';

export class Mooncake {

  public static async createApp<T extends IApplication>(applicationClass: Class<IApplication>, mainModule: Class<any>, options: IApplicationOptions): Promise<T> {
    const moduleName: string = Reflect.getMetadata('module:name', mainModule);
    const moduleOptions: IModuleOptions = Reflect.getMetadata('module:options', mainModule);
    if(moduleName === undefined || moduleOptions === undefined)
      throw new Error(`Invalid module provided!`);
    const module: IModule = { name: moduleName, moduleClass: mainModule, options: moduleOptions };
    const app: IApplication = <T> new applicationClass(module, options);
    await app.onInitialization();
    return <T> app;
  }

}