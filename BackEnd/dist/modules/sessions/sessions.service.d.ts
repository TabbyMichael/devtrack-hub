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
    stop(userId: string, sessionId: string, dto: StopSessionDto): Promise<{
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
    findAll(userId: string, page?: number, limit?: number, fromDate?: string, toDate?: string, projectId?: string): Promise<{
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
    getActiveSession(userId: string): Promise<{
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
}
