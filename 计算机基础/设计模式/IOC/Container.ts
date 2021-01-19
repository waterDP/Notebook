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
import { Type } from './type'
import {getInjectionToken} from './Inject'

const DESIGN_PARAMTYPES = 'design:paramtypes'

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
    const params = this.getInjectedParams(target)
    return Reflect.construct(target, params)
  }

  // 从类上获取要到注入的参数
  getInjectedParams<T>(target: Type<T>) {
    let argTypes = <Array<Type<any>>>Reflect.getMetadata(DESIGN_PARAMTYPES, target)
    if (argTypes === undefined) return []
    return argTypes.map((argType: Type<any>, index: number) => {
      const overrideToken = getInjectionToken(target, index)
      const actualToken = overrideToken === undefined ? argTypes : overrideToken
      let provider = this.providers.get(actualToken)
      return this.injectWithProvider(argType, provider)
    })
  }

  injectValue<T>(provider: ValueProvider<T>): T {
    return provider.useValue
  }

  injectFactory<T>(provider: FactoryProvider<T>): T {
    return provider.useFactory()
  }

}