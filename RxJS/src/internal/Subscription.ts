import { SubscriptionLike, TeardownLogic } from "./types";
import { debugMode } from "../../../ZRender/src/config";

  export class Subscription implements SubscriptionLike {
    constructor(private initialTeardown?: () => void) {}
  unsubscribe(): void {}  
  public closed: boolean = false;

  add(teardown: TeardownLogic) {}
}
