"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const prom_client_1 = require("prom-client");
let MetricsService = class MetricsService {
    constructor(httpRequestsTotal, httpRequestDuration, activeSessions, totalUsers) {
        this.httpRequestsTotal = httpRequestsTotal;
        this.httpRequestDuration = httpRequestDuration;
        this.activeSessions = activeSessions;
        this.totalUsers = totalUsers;
    }
    incrementHttpRequests(method, route, statusCode) {
        this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    }
    recordHttpDuration(method, route, duration) {
        this.httpRequestDuration.observe({ method, route }, duration);
    }
    setActiveSessions(count) {
        this.activeSessions.set(count);
    }
    setTotalUsers(count) {
        this.totalUsers.set(count);
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_prometheus_1.InjectMetric)('http_requests_total')),
    __param(1, (0, nestjs_prometheus_1.InjectMetric)('http_request_duration_seconds')),
    __param(2, (0, nestjs_prometheus_1.InjectMetric)('active_sessions')),
    __param(3, (0, nestjs_prometheus_1.InjectMetric)('total_users')),
    __metadata("design:paramtypes", [prom_client_1.Counter,
        prom_client_1.Histogram,
        prom_client_1.Gauge,
        prom_client_1.Gauge])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map