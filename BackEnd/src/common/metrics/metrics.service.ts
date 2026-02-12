import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
    constructor(
        @InjectMetric('http_requests_total')
        public httpRequestsTotal: Counter<string>,
        @InjectMetric('http_request_duration_seconds')
        public httpRequestDuration: Histogram<string>,
        @InjectMetric('active_sessions')
        public activeSessions: Gauge<string>,
        @InjectMetric('total_users')
        public totalUsers: Gauge<string>,
    ) { }

    incrementHttpRequests(method: string, route: string, statusCode: number) {
        this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    }

    recordHttpDuration(method: string, route: string, duration: number) {
        this.httpRequestDuration.observe({ method, route }, duration);
    }

    setActiveSessions(count: number) {
        this.activeSessions.set(count);
    }

    setTotalUsers(count: number) {
        this.totalUsers.set(count);
    }
}
