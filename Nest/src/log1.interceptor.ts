import { NestInterceptor } from "@nestjs/common";
import { ExecutionContext } from "./@nestjs/common/execution-context.interface";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CallHandler } from "./@nestjs/common/nest-interceptor.interface";

export class Logging1Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("before1...");
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`after1...${Date.now() - now}ms`);
      })
    );
  }
}
