import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AiInsightsService } from './ai-insights.service';
import { JwtAuthGuard } from '../auth/guards';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('AI Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/ai-insights')
export class AiInsightsController {
  constructor(private readonly aiInsightsService: AiInsightsService) {}

  @Get('productivity')
  @ApiOperation({ summary: 'Get AI-powered productivity insights' })
  @ApiResponse({ status: 200, description: 'Productivity insights generated successfully' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default: 30)' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Team ID to filter insights' })
  async getProductivityInsights(
    @Request() req,
    @Query('days') days?: string,
    @Query('teamId') teamId?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.aiInsightsService.generateProductivityInsights(
      req.user.id,
      teamId,
      daysNum,
    );
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations generated successfully' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Team ID to filter recommendations' })
  async getRecommendations(
    @Request() req,
    @Query('teamId') teamId?: string,
  ) {
    return this.aiInsightsService.getPersonalizedRecommendations(
      req.user.id,
      teamId,
    );
  }

  @Get('patterns')
  @ApiOperation({ summary: 'Get productivity patterns analysis' })
  @ApiResponse({ status: 200, description: 'Patterns analysis completed' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default: 30)' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Team ID to filter analysis' })
  async getPatterns(
    @Request() req,
    @Query('days') days?: string,
    @Query('teamId') teamId?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    const insights = await this.aiInsightsService.generateProductivityInsights(
      req.user.id,
      teamId,
      daysNum,
    );
    
    return insights.filter(insight => 
      insight.type === 'productivity_pattern' || 
      insight.type === 'trend_prediction'
    );
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Detect productivity anomalies' })
  @ApiResponse({ status: 200, description: 'Anomaly detection completed' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default: 30)' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Team ID to filter analysis' })
  async getAnomalies(
    @Request() req,
    @Query('days') days?: string,
    @Query('teamId') teamId?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    const insights = await this.aiInsightsService.generateProductivityInsights(
      req.user.id,
      teamId,
      daysNum,
    );
    
    return insights.filter(insight => insight.type === 'anomaly_detection');
  }

  @Get('optimizations')
  @ApiOperation({ summary: 'Get optimization suggestions' })
  @ApiResponse({ status: 200, description: 'Optimization suggestions generated' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default: 30)' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Team ID to filter suggestions' })
  async getOptimizations(
    @Request() req,
    @Query('days') days?: string,
    @Query('teamId') teamId?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    const insights = await this.aiInsightsService.generateProductivityInsights(
      req.user.id,
      teamId,
      daysNum,
    );
    
    return insights.filter(insight => insight.type === 'optimization_suggestion');
  }
}