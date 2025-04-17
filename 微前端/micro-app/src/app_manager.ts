import { appInstanceMap } from './create_app'
import { AppInterface } from '@micro-app/types'

export interface IAppManager {
  get(appName: string): AppInterface | void
  set(appName: string, app: AppInterface): void
  getAll(): AppInterface[]
  clear(): void
}

// 管理 app 的单例
export class AppManager implements IAppManager {
  private static instance: AppManager;
  // TODO: appInstanceMap 由 AppManager 来创建，不再由 create_app 管理
  private appInstanceMap = appInstanceMap;

  public static getInstance (): AppManager {
    if (!this.instance) {
      this.instance = new AppManager()
    }
    return this.instance
  }

  public get (appName: string): AppInterface | void {
    return this.appInstanceMap.get(appName)
  }

  public set (appName: string, app: AppInterface): void {
    this.appInstanceMap.set(appName, app)
  }

  public getAll (): AppInterface[] {
    return Array.from(this.appInstanceMap.values())
  }

  public clear (): void {
    this.appInstanceMap.clear()
  }
}
