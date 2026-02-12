"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsProviders = void 0;
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
exports.metricsProviders = [
    (0, nestjs_prometheus_1.makeCounterProvider)({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
    }),
    (0, nestjs_prometheus_1.makeHistogramProvider)({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'route'],
        buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    }),
    (0, nestjs_prometheus_1.makeGaugeProvider)({
        name: 'active_sessions',
        help: 'Number of currently active sessions',
    }),
    (0, nestjs_prometheus_1.makeGaugeProvider)({
        name: 'total_users',
        help: 'Total number of registered users',
    }),
];
//# sourceMappingURL=metrics.providers.js.map