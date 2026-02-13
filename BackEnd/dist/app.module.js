"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./modules/auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const configuration_1 = require("./config/configuration");
const env_validation_1 = require("./config/env.validation");
const projects_module_1 = require("./modules/projects/projects.module");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const health_module_1 = require("./modules/health/health.module");
const export_module_1 = require("./modules/export/export.module");
const metrics_module_1 = require("./common/metrics/metrics.module");
const queue_module_1 = require("./queue/queue.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const cache_module_1 = require("./common/cache/cache.module");
const teams_module_1 = require("./modules/teams/teams.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.configuration],
                validate: env_validation_1.validate,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 10,
                },
                {
                    name: 'medium',
                    ttl: 60000,
                    limit: 100,
                },
                {
                    name: 'long',
                    ttl: 3600000,
                    limit: 1000,
                },
            ]),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            projects_module_1.ProjectsModule,
            sessions_module_1.SessionsModule,
            analytics_module_1.AnalyticsModule,
            health_module_1.HealthModule,
            export_module_1.ExportModule,
            metrics_module_1.MetricsModule,
            queue_module_1.QueueModule,
            cache_module_1.CacheConfigModule,
            teams_module_1.TeamsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map