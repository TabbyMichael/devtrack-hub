import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { configuration } from './config/configuration';
import { validate } from './config/env.validation';
import { ProjectsModule } from './modules/projects/projects.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { ExportModule } from './modules/export/export.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { QueueModule } from './queue/queue.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CacheConfigModule } from './common/cache/cache.module';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour
      },
    ]),
    AuthModule,
    PrismaModule,
    ProjectsModule,
    SessionsModule,
    AnalyticsModule,
    HealthModule,
    ExportModule,
    MetricsModule,
    QueueModule,
    CacheConfigModule,
    TeamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}