import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller({ path: 'analytics', version: '1' })
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor) // Cache all analytics endpoints
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('daily')
    @CacheTTL(300) // Cache for 5 minutes
    @ApiOperation({ summary: 'Get daily session totals' })
    @ApiBearerAuth()
    @ApiQuery({ name: 'from', required: false, type: String, example: '2024-01-01' })
    @ApiQuery({ name: 'to', required: false, type: String, example: '2024-12-31' })
    @ApiQuery({ name: 'tz', required: false, type: String, example: 'UTC' })
    @ApiResponse({ status: 200, description: 'Daily totals retrieved successfully' })
    getDailyTotals(
        @GetUser('id') userId: string,
        @Query('from') fromDate: string,
        @Query('to') toDate: string,
        @Query('tz') timezone?: string,
    ) {
        return this.analyticsService.getDailyTotals(userId, fromDate, toDate, timezone);
    }

    @Get('streak')
    @CacheTTL(300) // Cache for 5 minutes
    @ApiOperation({ summary: 'Get current and longest streak' })
    @ApiResponse({ status: 200, description: 'Streak data retrieved successfully' })
    getStreak(@GetUser('id') userId: string) {
        return this.analyticsService.getStreak(userId);
    }

    @Get('projects')
    @CacheTTL(300) // Cache for 5 minutes
    @ApiOperation({ summary: 'Get project-specific aggregates' })
    @ApiQuery({ name: 'from', required: false, type: String, example: '2024-01-01' })
    @ApiQuery({ name: 'to', required: false, type: String, example: '2024-12-31' })
    @ApiResponse({ status: 200, description: 'Project aggregates retrieved successfully' })
    getProjectAggregates(
        @GetUser('id') userId: string,
        @Query('from') fromDate?: string,
        @Query('to') toDate?: string,
    ) {
        return this.analyticsService.getProjectAggregates(userId, fromDate, toDate);
    }
}
