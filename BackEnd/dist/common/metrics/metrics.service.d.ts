import { Counter, Histogram, Gauge } from 'prom-client';
export declare class MetricsService {
    httpRequestsTotal: Counter<string>;
    httpRequestDuration: Histogram<string>;
    activeSessions: Gauge<string>;
    totalUsers: Gauge<string>;
    constructor(httpRequestsTotal: Counter<string>, httpRequestDuration: Histogram<string>, activeSessions: Gauge<string>, totalUsers: Gauge<string>);
    incrementHttpRequests(method: string, route: string, statusCode: number): void;
    recordHttpDuration(method: string, route: string, duration: number): void;
    setActiveSessions(count: number): void;
    setTotalUsers(count: number): void;
}
