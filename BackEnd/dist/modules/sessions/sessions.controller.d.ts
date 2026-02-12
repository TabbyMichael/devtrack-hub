import { SessionsService } from './sessions.service';
import { StartSessionDto, StopSessionDto } from './dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    start(userId: string, dto: StartSessionDto): Promise<{
        project: {
            id: string;
            name: string;
            color: string;
        };
        id: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
        notes: string;
        createdAt: Date;
        projectId: string;
    }>;
    stop(userId: string, id: string, dto: StopSessionDto): Promise<{
        project: {
            id: string;
            name: string;
            color: string;
        };
        id: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
        notes: string;
        createdAt: Date;
        projectId: string;
    }>;
    getActive(userId: string): Promise<{
        elapsedMinutes: number;
        project: {
            id: string;
            name: string;
            color: string;
        };
        id: string;
        startTime: Date;
        createdAt: Date;
        projectId: string;
    }>;
    findAll(userId: string, page: number, limit: number, fromDate?: string, toDate?: string, projectId?: string): Promise<{
        data: {
            project: {
                id: string;
                name: string;
                color: string;
            };
            id: string;
            startTime: Date;
            endTime: Date;
            durationMinutes: number;
            notes: string;
            createdAt: Date;
            projectId: string;
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
            id: string;
            name: string;
            color: string;
        };
        id: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
        notes: string;
        createdAt: Date;
        projectId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
