import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDailyTotals(userId: string, fromDate: string, toDate: string, timezone?: string): Promise<import("./analytics.service").DailyTotal[]>;
    getStreak(userId: string): Promise<{
        currentStreak: number;
        longestStreak: number;
    }>;
    getProjectAggregates(userId: string, fromDate?: string, toDate?: string): Promise<{
        project: any;
        totalHours: number;
        totalMinutes: number;
        sessionCount: number;
    }[]>;
}
