import {
  Token,
  Provider,
  ValueProvider,
  ClassProvider,
  FactoryProvider,
  isClassProvider,
  isValueProvider,
  isFactoryProvider,
  InjectionToken
} from './provider'

export class Container {
  private providers = new Map<Token<any>, Provider<any>>()

  // 注册提供者
  addProvider<T>(provider: Provider<T>) {
    this.providers.set(provider.provide, provider)
  }

  inject(type: Token<any>) {
    let provider = this.providers.get(type)
    return this.injectWithProvider(type, provider)
  }

  injectWithProvider<T>(type: Token<T>, provider: Provider<T>) {
    if (provider === undefined) {
      throw new Error(`No provider for ${this.getTokenName(type)}`)
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider)
    }
    if (isValueProvider(provider)) {
      return this.injectValue(provider)
    }
    if (isFactoryProvider(provider)) {
      return this.injectFactory(provider)
    }
  }

  getTokenName<T>(type: Token<T>) {
    return type instanceof InjectionToken ? type.injectionIndentifier : type.name
  }

  injectClass<T>(provider: ClassProvider<T>) { 
    const target = provider.useClass
    const params = []
    return Reflect.construct(target, params)
    // return new provider.useClass()
  }

  injectValue<T>(provider: ValueProvider<T>): T {
    return provider.useValue
  }

  injectFactory<T>(provider: FactoryProvider<T>): T {
    return provider.useFactory()
  }

}