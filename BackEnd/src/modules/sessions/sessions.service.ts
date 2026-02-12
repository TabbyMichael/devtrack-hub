import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    ConflictException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StartSessionDto, StopSessionDto } from './dto';
import { SessionGateway } from './session.gateway';

@Injectable()
export class SessionsService {
    private readonly MIN_DURATION_MINUTES = 1;
    private readonly MAX_DURATION_MINUTES = 1440; // 24 hours

    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => SessionGateway))
        private readonly sessionGateway: SessionGateway,
    ) { }

    async start(userId: string, dto: StartSessionDto) {
        // Check if project exists and belongs to user
        const project = await this.prisma.project.findFirst({
            where: {
                id: dto.projectId,
                userId,
                deletedAt: null,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found or does not belong to you');
        }

        // Check for active sessions (overlap)
        const activeSession = await this.prisma.session.findFirst({
            where: {
                userId,
                endTime: null,
            },
        });

        if (activeSession) {
            throw new ConflictException(
                'You already have an active session. Please stop it before starting a new one.',
            );
        }

        // Create session
        const session = await this.prisma.session.create({
            data: {
                projectId: dto.projectId,
                userId,
                startTime: new Date(),
            },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                durationMinutes: true,
                notes: true,
                projectId: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
                createdAt: true,
            },
        });

        // Emit WebSocket event
        this.sessionGateway.emitSessionStarted(userId, session);

        return session;
    }

    async stop(userId: string, sessionId: string, dto: StopSessionDto) {
        // Find active session
        const session = await this.prisma.session.findFirst({
            where: {
                id: sessionId,
                userId,
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.endTime) {
            throw new BadRequestException('Session already stopped');
        }

        const endTime = new Date();
        const durationMs = endTime.getTime() - session.startTime.getTime();
        const durationMinutes = Math.round(durationMs / 60000);

        // Validate duration
        if (durationMinutes < this.MIN_DURATION_MINUTES) {
            throw new BadRequestException(
                `Session duration must be at least ${this.MIN_DURATION_MINUTES} minute(s)`,
            );
        }

        if (durationMinutes > this.MAX_DURATION_MINUTES) {
            throw new BadRequestException(
                `Session duration cannot exceed ${this.MAX_DURATION_MINUTES} minutes (24 hours)`,
            );
        }

        // Update session
        const updatedSession = await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                endTime,
                durationMinutes,
                notes: dto.notes,
            },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                durationMinutes: true,
                notes: true,
                projectId: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
                createdAt: true,
            },
        });

        // Emit WebSocket event
        this.sessionGateway.emitSessionStopped(userId, updatedSession);

        return updatedSession;
    }

    async findAll(
        userId: string,
        page: number = 1,
        limit: number = 20,
        fromDate?: string,
        toDate?: string,
        projectId?: string,
    ) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);

        // Build where clause
        const where: any = { userId };

        if (fromDate || toDate) {
            where.startTime = {};
            if (fromDate) {
                where.startTime.gte = new Date(fromDate);
            }
            if (toDate) {
                where.startTime.lte = new Date(toDate);
            }
        }

        if (projectId) {
            where.projectId = projectId;
        }

        const [sessions, total] = await Promise.all([
            this.prisma.session.findMany({
                where,
                select: {
                    id: true,
                    startTime: true,
                    endTime: true,
                    durationMinutes: true,
                    notes: true,
                    projectId: true,
                    project: {
                        select: {
                            id: true,
                            name: true,
                            color: true,
                        },
                    },
                    createdAt: true,
                },
                orderBy: { startTime: 'desc' },
                skip,
                take,
            }),
            this.prisma.session.count({ where }),
        ]);

        return {
            data: sessions,
            meta: {
                total,
                page,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    async findOne(userId: string, id: string) {
        const session = await this.prisma.session.findFirst({
            where: { id },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                durationMinutes: true,
                notes: true,
                userId: true,
                projectId: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
                createdAt: true,
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.userId !== userId) {
            throw new ForbiddenException('You do not have access to this session');
        }

        const { userId: _, ...sessionData } = session;
        return sessionData;
    }

    async remove(userId: string, id: string) {
        // Check ownership
        await this.findOne(userId, id);

        await this.prisma.session.delete({
            where: { id },
        });

        return { message: 'Session deleted successfully' };
    }

    async getActiveSession(userId: string) {
        const session = await this.prisma.session.findFirst({
            where: {
                userId,
                endTime: null,
            },
            select: {
                id: true,
                startTime: true,
                projectId: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
                createdAt: true,
            },
        });

        if (!session) {
            return null;
        }

        // Calculate elapsed time
        const elapsedMs = Date.now() - session.startTime.getTime();
        const elapsedMinutes = Math.round(elapsedMs / 60000);

        return {
            ...session,
            elapsedMinutes,
        };
    }
}
