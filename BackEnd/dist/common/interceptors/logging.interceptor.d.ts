import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
export declare class LoggingInterceptor implements NestInterceptor {
    private logger;
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}
