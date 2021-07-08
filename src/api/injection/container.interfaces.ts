import { ProviderKey } from "../../types";
import { IProviderFactory } from "./provider.interfaces";

export interface IContainer {
  register<T>(key: ProviderKey<T>): IProviderFactory;
  resolve<T>(key: ProviderKey<T>): T;
}