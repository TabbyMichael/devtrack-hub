import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger("HTTP");
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();
    return next.handle().pipe(tap(() => this.logger.log(`${method} ${url} ${Date.now() - now}ms`)));
  }
}
