import { IContainer } from "./container.interfaces";
import { IClassProvider } from "./provider.interfaces";

export interface IScope {
  resolve<T>(provider: IClassProvider<T>, container: IContainer): T;
}