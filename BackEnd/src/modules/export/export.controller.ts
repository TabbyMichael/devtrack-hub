import { Controller, Get, UseGuards, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Export')
@Controller({ path: 'export', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportController {
    constructor(private readonly exportService: ExportService) { }

    @Get('sessions/csv')
    @ApiOperation({ summary: 'Export sessions as CSV' })
    @ApiQuery({ name: 'from', required: false, type: String, example: '2024-01-01' })
    @ApiQuery({ name: 'to', required: false, type: String, example: '2024-12-31' })
    @ApiQuery({ name: 'projectId', required: false, type: String })
    @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
    async exportCSV(
        @GetUser('id') userId: string,
        @Query('from') fromDate?: string,
        @Query('to') toDate?: string,
        @Query('projectId') projectId?: string,
        @Res() res?: Response,
    ) {
        try {
            const csv = await this.exportService.exportSessionsCSV(userId, fromDate, toDate, projectId);

            const filename = `sessions-${Date.now()}.csv`;

            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(HttpStatus.OK).send(csv);
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: error.message,
            });
        }
    }

    @Get('sessions/json')
    @ApiOperation({ summary: 'Export sessions as JSON' })
    @ApiQuery({ name: 'from', required: false, type: String, example: '2024-01-01' })
    @ApiQuery({ name: 'to', required: false, type: String, example: '2024-12-31' })
    @ApiQuery({ name: 'projectId', required: false, type: String })
    @ApiResponse({ status: 200, description: 'JSON file generated successfully' })
    async exportJSON(
        @GetUser('id') userId: string,
        @Query('from') fromDate?: string,
        @Query('to') toDate?: string,
        @Query('projectId') projectId?: string,
        @Res() res?: Response,
    ) {
        try {
            const data = await this.exportService.exportSessionsJSON(userId, fromDate, toDate, projectId);

            const filename = `sessions-${Date.now()}.json`;

            res.header('Content-Type', 'application/json');
            res.header('Content-Disposition', `attachment; filename="${filename}"`);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: error.message,
            });
        }
    }
}
