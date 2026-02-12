"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
require("reflect-metadata");
const sentry_config_1 = require("./config/sentry.config");
async function bootstrap() {
    (0, sentry_config_1.initializeSentry)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    });
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('DevTrack API')
        .setDescription('Project and session tracking API with analytics')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Projects', 'Project management')
        .addTag('Sessions', 'Session tracking')
        .addTag('Analytics', 'Analytics and insights')
        .addTag('Health', 'Health check')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map