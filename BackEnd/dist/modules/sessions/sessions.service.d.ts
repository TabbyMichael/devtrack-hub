import { PrismaService } from '../../prisma/prisma.service';
import { StartSessionDto, StopSessionDto } from './dto';
import { SessionGateway } from './session.gateway';
export declare class SessionsService {
    private readonly prisma;
    private readonly sessionGateway;
    private readonly MIN_DURATION_MINUTES;
    private readonly MAX_DURATION_MINUTES;
    constructor(prisma: PrismaService, sessionGateway: SessionGateway);
    start(userId: string, dto: StartSessionDto): Promise<{
        project: {
            name: string;
            id: string;
            color: string;
        };
        id: string;
        createdAt: Date;
        projectId: string;
        notes: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
    }>;
    stop(userId: string, sessionId: string, dto: StopSessionDto): Promise<{
        project: {
            name: string;
            id: string;
            color: string;
        };
        id: string;
        createdAt: Date;
        projectId: string;
        notes: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
        isPaused: boolean;
        totalPauseSeconds: number;
    }>;
    pause(userId: string, sessionId: string): Promise<{
        id: string;
        startTime: Date;
        endTime: Date | null;
        durationMinutes: number | null;
        notes: string | null;
        isPaused: boolean;
        lastPauseTime: Date | null;
        totalPauseSeconds: number;
        projectId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resume(userId: string, sessionId: string): Promise<{
        id: string;
        startTime: Date;
        endTime: Date | null;
        durationMinutes: number | null;
        notes: string | null;
        isPaused: boolean;
        lastPauseTime: Date | null;
        totalPauseSeconds: number;
        projectId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string, page?: number, limit?: number, fromDate?: string, toDate?: string, projectId?: string): Promise<{
        data: {
            project: {
                name: string;
                id: string;
                color: string;
            };
            id: string;
            createdAt: Date;
            projectId: string;
            notes: string;
            startTime: Date;
            endTime: Date;
            durationMinutes: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(userId: string, id: string): Promise<{
        project: {
            name: string;
            id: string;
            color: string;
        };
        id: string;
        createdAt: Date;
        projectId: string;
        notes: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    getActiveSession(userId: string): Promise<{
        elapsedMinutes: number;
        project: {
            name: string;
            id: string;
            color: string;
        };
        id: string;
        createdAt: Date;
        projectId: string;
        startTime: Date;
        isPaused: boolean;
        lastPauseTime: Date;
        totalPauseSeconds: number;
    }>;
}
