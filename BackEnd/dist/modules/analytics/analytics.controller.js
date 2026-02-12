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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const analytics_service_1 = require("./analytics.service");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const swagger_1 = require("@nestjs/swagger");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getDailyTotals(userId, fromDate, toDate, timezone) {
        return this.analyticsService.getDailyTotals(userId, fromDate, toDate, timezone);
    }
    getStreak(userId) {
        return this.analyticsService.getStreak(userId);
    }
    getProjectAggregates(userId, fromDate, toDate) {
        return this.analyticsService.getProjectAggregates(userId, fromDate, toDate);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('daily'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily session totals' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String, example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String, example: '2024-12-31' }),
    (0, swagger_1.ApiQuery)({ name: 'tz', required: false, type: String, example: 'UTC' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily totals retrieved successfully' }),
    __param(0, (0, decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('tz')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getDailyTotals", null);
__decorate([
    (0, common_1.Get)('streak'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get current and longest streak' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Streak data retrieved successfully' }),
    __param(0, (0, decorators_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getStreak", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get project-specific aggregates' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String, example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String, example: '2024-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project aggregates retrieved successfully' }),
    __param(0, (0, decorators_1.GetUser)('id')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getProjectAggregates", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)({ path: 'analytics', version: '1' }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map