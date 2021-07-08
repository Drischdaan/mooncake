import { IClassProvider, IFactoryProvider, IValueProvider } from "./api/injection/provider.interfaces";

export type Class<T> = { new(...args: any[]): T; };

export type FactoryFunction<T> = () => T;

export type ProviderKey<T> = string | symbol | Class<T>;

export type ProviderType<T> = (Class<any> | IClassProvider<T> | IFactoryProvider<T> | IValueProvider<T>);

export type Options<T> = T;