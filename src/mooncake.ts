import { IApplication } from "./api/application/application.interfaces";
import { IModule, IModuleMetadata } from "./api/module/module.interfaces";
import { ModuleHelper } from "./module/module.helper";
import { Class, Options } from "./types";

export class Mooncake {

  static async createApp<T extends IApplication>(appClass: Class<T>, mainModule: Class<any>, options: Options<T>): Promise<T> {
    const metadata: IModuleMetadata = Reflect.getMetadata('module:metadata', mainModule);
    if(metadata === undefined)
      throw new Error(`Couldn't retrieve metadata from module: ${mainModule}`);
    const helper: ModuleHelper = new ModuleHelper();
    const module: IModule = helper.createModule(helper.createDynamicModule(mainModule));
    await helper.initializeModule(module);
    return new appClass(module, options);
  }

}