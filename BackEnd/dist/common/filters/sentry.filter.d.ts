import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class SentryFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
