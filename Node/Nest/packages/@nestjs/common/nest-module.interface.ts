import { MiddlewareConsumer } from "./middleware-consumer.interface"
export interface NestModule {
  configure(comsumer: MiddlewareConsumer): void;
}