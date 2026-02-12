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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailyTotals(userId, fromDate, toDate, timezone = 'UTC') {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const sessions = await this.prisma.session.findMany({
            where: {
                userId,
                startTime: {
                    gte: from,
                    lte: to,
                },
                endTime: { not: null },
            },
            select: {
                startTime: true,
                durationMinutes: true,
            },
            orderBy: { startTime: 'asc' },
        });
        const dailyMap = {};
        sessions.forEach((session) => {
            const date = session.startTime.toISOString().split('T')[0];
            if (!dailyMap[date]) {
                dailyMap[date] = { hours: 0, count: 0 };
            }
            dailyMap[date].hours += (session.durationMinutes || 0) / 60;
            dailyMap[date].count += 1;
        });
        return Object.entries(dailyMap).map(([date, data]) => ({
            date,
            hours: Math.round(data.hours * 100) / 100,
            sessionCount: data.count,
        }));
    }
    async getStreak(userId) {
        const sessions = await this.prisma.session.findMany({
            where: {
                userId,
                endTime: { not: null },
            },
            select: {
                startTime: true,
            },
            orderBy: { startTime: 'desc' },
        });
        if (sessions.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }
        const dates = Array.from(new Set(sessions.map((s) => s.startTime.toISOString().split('T')[0]))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        let currentStreak = 1;
        let longestStreak = 1;
        let tempStreak = 1;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (dates[0] !== today && dates[0] !== yesterday) {
            currentStreak = 0;
        }
        for (let i = 1; i < dates.length; i++) {
            const diff = new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime();
            const daysDiff = diff / (1000 * 60 * 60 * 24);
            if (daysDiff === 1) {
                tempStreak++;
                if (currentStreak > 0 && i === tempStreak - 1) {
                    currentStreak = tempStreak;
                }
            }
            else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
        return { currentStreak, longestStreak };
    }
    async getProjectAggregates(userId, fromDate, toDate) {
        const where = {
            userId,
            endTime: { not: null },
        };
        if (fromDate || toDate) {
            where.startTime = {};
            if (fromDate)
                where.startTime.gte = new Date(fromDate);
            if (toDate)
                where.startTime.lte = new Date(toDate);
        }
        const sessions = await this.prisma.session.findMany({
            where,
            select: {
                projectId: true,
                durationMinutes: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
            },
        });
        const projectMap = {};
        sessions.forEach((session) => {
            const { projectId, durationMinutes, project } = session;
            if (!projectMap[projectId]) {
                projectMap[projectId] = {
                    project,
                    totalMinutes: 0,
                    sessionCount: 0,
                };
            }
            projectMap[projectId].totalMinutes += durationMinutes || 0;
            projectMap[projectId].sessionCount += 1;
        });
        return Object.values(projectMap).map((data) => ({
            project: data.project,
            totalHours: Math.round((data.totalMinutes / 60) * 100) / 100,
            totalMinutes: data.totalMinutes,
            sessionCount: data.sessionCount,
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map