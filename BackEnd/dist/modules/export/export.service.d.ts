import { PrismaService } from '../../prisma/prisma.service';
export declare class ExportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    exportSessionsCSV(userId: string, fromDate?: string, toDate?: string, projectId?: string): Promise<string>;
    exportSessionsJSON(userId: string, fromDate?: string, toDate?: string, projectId?: string): Promise<any[]>;
    private getSessionsForExport;
}
