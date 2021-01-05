import {
  Token, 
  Provider,
  ValueProvider,
  ClassProvider,
  FactoryProvider,
  isClassProvider,
  isValueProvider,
  isFactorProvider,
  InjectionToken
} from './provider'


export class Container {
  public providers = new Map<Token<any>, Provider<any>>()
  // 注册提供者
  addProvider<T>(provider: Provider<T>) {
    // provide就是token或者说是标识符
    this.providers.set(provider.provide, provider)
  }
  // todo 根据token创建对应的实例 注入 获取对应的服务
  inject(type: Token<any>) {
    let provider = this.providers.get(type)
    return this.injectWithProvider(type, provider)
  }

  injectWithProvider<T>(type: Token<T>, provider: Provider<T>) {
    if (provider === undefined) {
      throw new Error(`No provider for type ${this.getTokenName(type)}`)  
    }
    if (isClassProvider(provider)) {
      // return this.injectClass(provider)
    }
    if (isValueProvider(provider)) {
      return this.injectValue(provider as ValueProvider<T>)
    }
    if (isFactorProvider(provider)) {
      return this.injectFactory(provider)
    }
  }

  getTokenName<T>(type: Token<T>) {
    return type instanceof InjectionToken ? type.injectionIdentifier : type.name
  }

  injectClass<T>(provider: ClassProvider<T>): T {
    const target = provider.useClass
    const params = []
    return Reflect.construct(target, params)
  }

  injectValue<T>(provider: ValueProvider<T>): T {
    return provider.useValue
  }

  injectFactory<T>(provider: FactoryProvider<T>): T {
    return provider.useFactory()
  }

}