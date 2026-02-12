import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { StartSessionDto, StopSessionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Sessions')
@Controller({ path: 'sessions', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @Post('start')
    @ApiOperation({ summary: 'Start a new session' })
    @ApiResponse({ status: 201, description: 'Session started successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    @ApiResponse({ status: 409, description: 'Active session already exists' })
    start(@GetUser('id') userId: string, @Body() dto: StartSessionDto) {
        return this.sessionsService.start(userId, dto);
    }

    @Post(':id/stop')
    @ApiOperation({ summary: 'Stop an active session' })
    @ApiResponse({ status: 200, description: 'Session stopped successfully' })
    @ApiResponse({ status: 404, description: 'Session not found' })
    @ApiResponse({ status: 400, description: 'Session already stopped or duration invalid' })
    stop(
        @GetUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: StopSessionDto,
    ) {
        return this.sessionsService.stop(userId, id, dto);
    }

    @Get('active')
    @ApiOperation({ summary: 'Get active session' })
    @ApiResponse({ status: 200, description: 'Active session retrieved' })
    @ApiResponse({ status: 404, description: 'No active session' })
    getActive(@GetUser('id') userId: string) {
        return this.sessionsService.getActiveSession(userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user sessions' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiQuery({ name: 'from', required: false, type: String, example: '2024-01-01' })
    @ApiQuery({ name: 'to', required: false, type: String, example: '2024-12-31' })
    @ApiQuery({ name: 'projectId', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
    findAll(
        @GetUser('id') userId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('from') fromDate?: string,
        @Query('to') toDate?: string,
        @Query('projectId') projectId?: string,
    ) {
        return this.sessionsService.findAll(userId, page, limit, fromDate, toDate, projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a session by ID' })
    @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Session not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findOne(@GetUser('id') userId: string, @Param('id') id: string) {
        return this.sessionsService.findOne(userId, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a session' })
    @ApiResponse({ status: 200, description: 'Session deleted successfully' })
    @ApiResponse({ status: 404, description: 'Session not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    remove(@GetUser('id') userId: string, @Param('id') id: string) {
        return this.sessionsService.remove(userId, id);
    }
}
