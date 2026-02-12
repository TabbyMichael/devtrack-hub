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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const json2csv_1 = require("json2csv");
let ExportService = class ExportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportSessionsCSV(userId, fromDate, toDate, projectId) {
        const sessions = await this.getSessionsForExport(userId, fromDate, toDate, projectId);
        if (sessions.length === 0) {
            throw new Error('No sessions found for the specified criteria');
        }
        const data = sessions.map((session) => ({
            ID: session.id,
            Project: session.project.name,
            'Start Time': session.startTime.toISOString(),
            'End Time': session.endTime ? session.endTime.toISOString() : 'In Progress',
            'Duration (minutes)': session.durationMinutes || 0,
            Notes: session.notes || '',
            'Created At': session.createdAt.toISOString(),
        }));
        const parser = new json2csv_1.Parser({
            fields: ['ID', 'Project', 'Start Time', 'End Time', 'Duration (minutes)', 'Notes', 'Created At'],
        });
        return parser.parse(data);
    }
    async exportSessionsJSON(userId, fromDate, toDate, projectId) {
        const sessions = await this.getSessionsForExport(userId, fromDate, toDate, projectId);
        return sessions.map((session) => ({
            id: session.id,
            project: {
                id: session.project.id,
                name: session.project.name,
                color: session.project.color,
            },
            startTime: session.startTime.toISOString(),
            endTime: session.endTime ? session.endTime.toISOString() : null,
            durationMinutes: session.durationMinutes,
            notes: session.notes,
            createdAt: session.createdAt.toISOString(),
        }));
    }
    async getSessionsForExport(userId, fromDate, toDate, projectId) {
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
        if (projectId) {
            where.projectId = projectId;
        }
        return this.prisma.session.findMany({
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
        });
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map