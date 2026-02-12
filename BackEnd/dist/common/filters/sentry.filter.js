"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryFilter = void 0;
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
let SentryFilter = class SentryFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        if (status >= 500) {
            Sentry.captureException(exception, {
                contexts: {
                    http: {
                        method: request.method,
                        url: request.url,
                        status_code: status,
                    },
                },
                user: request.user
                    ? {
                        id: request.user.id,
                        email: request.user.email,
                    }
                    : undefined,
            });
        }
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'string' ? message : message.message,
        });
    }
};
exports.SentryFilter = SentryFilter;
exports.SentryFilter = SentryFilter = __decorate([
    (0, common_1.Catch)()
], SentryFilter);
//# sourceMappingURL=sentry.filter.js.map