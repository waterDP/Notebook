import { ExecutionContext } from "./execution-context.interface";

export interface NestInterceptor {
  intercept(context: ExecutionContext, next);
}
