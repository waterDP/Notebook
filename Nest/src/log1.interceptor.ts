import { CallHandler, NestInterceptor } from "@nestjs/common";
import { ExecutionContext } from "./@nestjs/common/execution-context.interface";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class Logging1Interceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    console.log("before1...");
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`after1...${Date.now() - now}ms`);
      })
    );
  }
}
