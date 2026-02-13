import { SessionsService } from './sessions.service';
import { StartSessionDto, StopSessionDto } from './dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
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
    stop(userId: string, id: string, dto: StopSessionDto): Promise<{
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
    pause(userId: string, id: string): Promise<{
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
    resume(userId: string, id: string): Promise<{
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
    getActive(userId: string): Promise<{
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
    findAll(userId: string, page: number, limit: number, fromDate?: string, toDate?: string, projectId?: string): Promise<{
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
}
