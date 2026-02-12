import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Capture exception in Sentry (only for 500 errors)
        if (status >= 500) {
            Sentry.captureException(exception, {
                contexts: {
                    http: {
                        method: request.method,
                        url: request.url,
                        status_code: status,
                    },
                },
                user: (request as any).user
                    ? {
                        id: (request as any).user.id,
                        email: (request as any).user.email,
                    }
                    : undefined,
            });
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : (message as any).message,
        });
    }
}
