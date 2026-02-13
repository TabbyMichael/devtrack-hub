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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const session_gateway_1 = require("./session.gateway");
let SessionsService = class SessionsService {
    constructor(prisma, sessionGateway) {
        this.prisma = prisma;
        this.sessionGateway = sessionGateway;
        this.MIN_DURATION_MINUTES = 1;
        this.MAX_DURATION_MINUTES = 1440;
    }
    async start(userId, dto) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: dto.projectId,
                userId,
                deletedAt: null,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found or does not belong to you');
        }
        const activeSession = await this.prisma.session.findFirst({
            where: {
                userId,
                endTime: null,
            },
        });
        if (activeSession) {
            throw new common_1.ConflictException('You already have an active session. Please stop it before starting a new one.');
        }
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
        this.sessionGateway.emitSessionStarted(userId, session);
        return session;
    }
    async stop(userId, sessionId, dto) {
        const session = await this.prisma.session.findFirst({
            where: {
                id: sessionId,
                userId,
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.endTime) {
            throw new common_1.BadRequestException('Session already stopped');
        }
        const endTime = new Date();
        let totalPauseSeconds = session.totalPauseSeconds;
        if (session.isPaused && session.lastPauseTime) {
            const currentPauseMs = endTime.getTime() - session.lastPauseTime.getTime();
            totalPauseSeconds += Math.round(currentPauseMs / 1000);
        }
        const totalElapsedMs = endTime.getTime() - session.startTime.getTime();
        const durationMs = totalElapsedMs - (totalPauseSeconds * 1000);
        const durationMinutes = Math.max(0, Math.round(durationMs / 60000));
        if (durationMinutes < this.MIN_DURATION_MINUTES) {
            throw new common_1.BadRequestException(`Session duration must be at least ${this.MIN_DURATION_MINUTES} minute(s)`);
        }
        if (durationMinutes > this.MAX_DURATION_MINUTES) {
            throw new common_1.BadRequestException(`Session duration cannot exceed ${this.MAX_DURATION_MINUTES} minutes (24 hours)`);
        }
        const updatedSession = await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                endTime,
                durationMinutes,
                notes: dto.notes,
                isPaused: false,
                totalPauseSeconds,
            },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                durationMinutes: true,
                notes: true,
                projectId: true,
                isPaused: true,
                totalPauseSeconds: true,
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
        this.sessionGateway.emitSessionStopped(userId, updatedSession);
        return updatedSession;
    }
    async pause(userId, sessionId) {
        const session = await this.prisma.session.findFirst({
            where: { id: sessionId, userId, endTime: null },
        });
        if (!session) {
            throw new common_1.NotFoundException('Active session not found');
        }
        if (session.isPaused) {
            throw new common_1.BadRequestException('Session already paused');
        }
        const updatedSession = await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                isPaused: true,
                lastPauseTime: new Date(),
            },
        });
        this.sessionGateway.emitSessionPaused(userId, updatedSession);
        return updatedSession;
    }
    async resume(userId, sessionId) {
        const session = await this.prisma.session.findFirst({
            where: { id: sessionId, userId, endTime: null },
        });
        if (!session) {
            throw new common_1.NotFoundException('Active session not found');
        }
        if (!session.isPaused) {
            throw new common_1.BadRequestException('Session is not paused');
        }
        const now = new Date();
        const pauseDurationMs = now.getTime() - (session.lastPauseTime?.getTime() || now.getTime());
        const additionalPauseSeconds = Math.round(pauseDurationMs / 1000);
        const updatedSession = await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                isPaused: false,
                lastPauseTime: null,
                totalPauseSeconds: session.totalPauseSeconds + additionalPauseSeconds,
            },
        });
        this.sessionGateway.emitSessionResumed(userId, updatedSession);
        return updatedSession;
    }
    async findAll(userId, page = 1, limit = 20, fromDate, toDate, projectId) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const where = { userId };
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
    async findOne(userId, id) {
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
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this session');
        }
        const { userId: _, ...sessionData } = session;
        return sessionData;
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        await this.prisma.session.delete({
            where: { id },
        });
        return { message: 'Session deleted successfully' };
    }
    async getActiveSession(userId) {
        const session = await this.prisma.session.findFirst({
            where: {
                userId,
                endTime: null,
            },
            select: {
                id: true,
                startTime: true,
                projectId: true,
                isPaused: true,
                lastPauseTime: true,
                totalPauseSeconds: true,
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
        let totalPauseSeconds = session.totalPauseSeconds;
        if (session.isPaused && session.lastPauseTime) {
            const currentPauseMs = Date.now() - session.lastPauseTime.getTime();
            totalPauseSeconds += Math.round(currentPauseMs / 1000);
        }
        const elapsedMs = Date.now() - session.startTime.getTime();
        const activeMs = elapsedMs - (totalPauseSeconds * 1000);
        const elapsedMinutes = Math.max(0, Math.round(activeMs / 60000));
        return {
            ...session,
            elapsedMinutes,
        };
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => session_gateway_1.SessionGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        session_gateway_1.SessionGateway])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map