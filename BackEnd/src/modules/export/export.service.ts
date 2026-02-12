import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Parser } from 'json2csv';

@Injectable()
export class ExportService {
    constructor(private readonly prisma: PrismaService) { }

    async exportSessionsCSV(
        userId: string,
        fromDate?: string,
        toDate?: string,
        projectId?: string,
    ): Promise<string> {
        const sessions = await this.getSessionsForExport(userId, fromDate, toDate, projectId);

        if (sessions.length === 0) {
            throw new Error('No sessions found for the specified criteria');
        }

        // Transform data for CSV
        const data = sessions.map((session) => ({
            ID: session.id,
            Project: session.project.name,
            'Start Time': session.startTime.toISOString(),
            'End Time': session.endTime ? session.endTime.toISOString() : 'In Progress',
            'Duration (minutes)': session.durationMinutes || 0,
            Notes: session.notes || '',
            'Created At': session.createdAt.toISOString(),
        }));

        const parser = new Parser({
            fields: ['ID', 'Project', 'Start Time', 'End Time', 'Duration (minutes)', 'Notes', 'Created At'],
        });

        return parser.parse(data);
    }

    async exportSessionsJSON(
        userId: string,
        fromDate?: string,
        toDate?: string,
        projectId?: string,
    ): Promise<any[]> {
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

    private async getSessionsForExport(
        userId: string,
        fromDate?: string,
        toDate?: string,
        projectId?: string,
    ) {
        const where: any = {
            userId,
            endTime: { not: null }, // Only export completed sessions
        };

        if (fromDate || toDate) {
            where.startTime = {};
            if (fromDate) where.startTime.gte = new Date(fromDate);
            if (toDate) where.startTime.lte = new Date(toDate);
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
}
