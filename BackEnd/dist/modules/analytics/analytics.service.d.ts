import { PrismaService } from '../../prisma/prisma.service';
export interface DailyTotal {
    date: string;
    hours: number;
    sessionCount: number;
}
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDailyTotals(userId: string, fromDate: string, toDate: string, timezone?: string): Promise<DailyTotal[]>;
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
