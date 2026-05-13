import { Observable } from "rxjs";
import { ExecutionContext } from "./execution-context.interface";

export interface NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler);
}

export interface CallHandler {
  handle(): Observable<any>;
}
