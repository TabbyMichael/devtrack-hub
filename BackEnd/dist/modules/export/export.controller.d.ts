import { Response } from 'express';
import { ExportService } from './export.service';
export declare class ExportController {
    private readonly exportService;
    constructor(exportService: ExportService);
    exportCSV(userId: string, fromDate?: string, toDate?: string, projectId?: string, res?: Response): Promise<void>;
    exportJSON(userId: string, fromDate?: string, toDate?: string, projectId?: string, res?: Response): Promise<void>;
}
