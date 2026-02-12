import { makeCounterProvider, makeHistogramProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';

export const metricsProviders = [
    makeCounterProvider({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
    }),
    makeHistogramProvider({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'route'],
        buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    }),
    makeGaugeProvider({
        name: 'active_sessions',
        help: 'Number of currently active sessions',
    }),
    makeGaugeProvider({
        name: 'total_users',
        help: 'Total number of registered users',
    }),
];
