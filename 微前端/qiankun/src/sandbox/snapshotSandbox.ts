/**
 * @author Hydrogen
 * @since 2020-3-8
 */
import type { SandBox } from '../interfaces';
import { SandBoxType } from '../interfaces';

function iter(obj: typeof window | Record<any, any>, callbackFn: (prop: any) => void) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in obj) {
    // patch for clearInterval for compatible reason, see #1490
    if (obj.hasOwnProperty(prop) || prop === 'clearInterval') {
      callbackFn(prop);
    }
  }
}

/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
export default class SnapshotSandbox implements SandBox {
  proxy: WindowProxy;

  name: string;

  type: SandBoxType;

  sandboxRunning = true;

  private windowSnapshot!: Window;

  private modifyPropsMap: Record<any, any> = {};

  private deletePropsSet: Set<any> = new Set();

  constructor(name: string) {
    this.name = name;
    this.proxy = window;
    this.type = SandBoxType.Snapshot;
  }

  active() {
    // 记录当前快照
    this.windowSnapshot = {} as Window;
    iter(window, (prop) => {
      this.windowSnapshot[prop] = window[prop];
    });

    // 恢复之前的变更
    Object.keys(this.modifyPropsMap).forEach((p: any) => {
      window[p] = this.modifyPropsMap[p];
    });

    // 删除之前删除的属性
    this.deletePropsSet.forEach((p: any) => {
      delete window[p];
    });

    this.sandboxRunning = true;
  }

  inactive() {
    this.modifyPropsMap = {};

    this.deletePropsSet.clear();

    iter(window, (prop) => {
      if (window[prop] !== this.windowSnapshot[prop]) {
        // 记录变更，恢复环境
        this.modifyPropsMap[prop] = window[prop];
        window[prop] = this.windowSnapshot[prop];
      }
    });

    iter(this.windowSnapshot, (prop) => {
      if (!window.hasOwnProperty(prop)) {
        // 记录被删除的属性，恢复环境
        this.deletePropsSet.add(prop);
        window[prop] = this.windowSnapshot[prop];
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.info(
        `[qiankun:sandbox] ${this.name} origin window restore...`,
        Object.keys(this.modifyPropsMap),
        this.deletePropsSet.keys(),
      );
    }

    this.sandboxRunning = false;
  }

  patchDocument(): void {}
}
