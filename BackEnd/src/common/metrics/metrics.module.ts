import { Module, Global } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';
import { metricsProviders } from './metrics.providers';
import { MetricsAuthGuard } from '../guards/metrics-auth.guard';

@Global()
@Module({
    imports: [
        PrometheusModule.register({
            path: '/metrics',
            defaultMetrics: {
                enabled: true,
            },
        }),
    ],
    providers: [MetricsService, ...metricsProviders, MetricsAuthGuard],
    exports: [MetricsService, MetricsAuthGuard],
})
export class MetricsModule { }
