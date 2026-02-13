import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProductivityPattern {
  pattern: string;
  confidence: number;
  recommendation: string;
  dataPoints: any[];
}

export interface AiInsight {
  id: string;
  type: 'productivity_pattern' | 'anomaly_detection' | 'trend_prediction' | 'optimization_suggestion';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  data: any;
  createdAt: Date;
}

@Injectable()
export class AiInsightsService {
  private readonly logger = new Logger(AiInsightsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateProductivityInsights(userId: string, teamId?: string, days: number = 30) {
    const insights: AiInsight[] = [];
    
    // Get user's session data
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
        ...(teamId && { teamId }),
      },
      include: {
        project: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (sessions.length === 0) {
      return insights;
    }

    // 1. Peak productivity hours analysis
    const hourlyInsights = this.analyzePeakHours(sessions);
    insights.push(...hourlyInsights);

    // 2. Project focus patterns
    const projectInsights = this.analyzeProjectFocus(sessions);
    insights.push(...projectInsights);

    // 3. Session duration patterns
    const durationInsights = this.analyzeSessionDurations(sessions);
    insights.push(...durationInsights);

    // 4. Consistency analysis
    const consistencyInsights = this.analyzeConsistency(sessions);
    insights.push(...consistencyInsights);

    // 5. Anomaly detection
    const anomalyInsights = this.detectAnomalies(sessions);
    insights.push(...anomalyInsights);

    // 6. Trend predictions
    const trendInsights = this.predictTrends(sessions);
    insights.push(...trendInsights);

    return insights;
  }

  private analyzePeakHours(sessions: any[]): AiInsight[] {
    const insights: AiInsight[] = [];
    
    // Group sessions by hour
    const hourlyData = new Array(24).fill(0).map(() => ({ hours: 0, sessions: 0 }));
    
    sessions.forEach(session => {
      const startHour = new Date(session.startTime).getHours();
      hourlyData[startHour].hours += session.durationMinutes || 0;
      hourlyData[startHour].sessions += 1;
    });

    // Find peak hours
    const peakHours = hourlyData
      .map((data, hour) => ({ hour, ...data }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 3);

    if (peakHours[0].hours > 0) {
      insights.push({
        id: `peak-hours-${Date.now()}`,
        type: 'productivity_pattern',
        title: 'Peak Productivity Hours',
        description: `Your most productive hours are between ${peakHours[0].hour}:00-${peakHours[0].hour + 1}:00 with ${Math.round(peakHours[0].hours / 60)} hours of work`,
        confidence: 0.85,
        priority: 'high',
        data: {
          peakHours,
          hourlyData,
        },
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private analyzeProjectFocus(sessions: any[]): AiInsight[] {
    const insights: AiInsight[] = [];
    
    // Group by project
    const projectData = sessions.reduce((acc, session) => {
      const projectId = session.projectId;
      if (!acc[projectId]) {
        acc[projectId] = {
          project: session.project,
          totalHours: 0,
          sessionCount: 0,
          avgDuration: 0,
        };
      }
      acc[projectId].totalHours += (session.durationMinutes || 0) / 60;
      acc[projectId].sessionCount += 1;
      return acc;
    }, {});

    const projects = Object.values(projectData)
      .sort((a: any, b: any) => b.totalHours - a.totalHours) as any[];

    if (projects.length > 1) {
      const dominantProject = projects[0];
      const secondProject = projects[1];
      
      if (dominantProject.totalHours > secondProject.totalHours * 2) {
        insights.push({
          id: `project-focus-${Date.now()}`,
          type: 'optimization_suggestion',
          title: 'Project Focus Analysis',
          description: `You're spending significantly more time on ${dominantProject.project.name} (${Math.round(dominantProject.totalHours)}h) compared to other projects. Consider balancing your focus.`,
          confidence: 0.9,
          priority: 'medium',
          data: {
            projects: projects.slice(0, 3),
            distribution: projects.map(p => ({
              name: p.project.name,
              hours: p.totalHours,
              percentage: Math.round((p.totalHours / projects.reduce((sum, p: any) => sum + p.totalHours, 0)) * 100),
            })),
          },
          createdAt: new Date(),
        });
      }
    }

    return insights;
  }

  private analyzeSessionDurations(sessions: any[]): AiInsight[] {
    const insights: AiInsight[] = [];
    
    const durations = sessions
      .filter(s => s.durationMinutes)
      .map(s => s.durationMinutes! / 60); // Convert to hours
    
    if (durations.length === 0) return insights;

    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const optimalDuration = 2.5; // 2.5 hours is considered optimal for deep work

    if (Math.abs(avgDuration - optimalDuration) > 0.5) {
      const recommendation = avgDuration > optimalDuration 
        ? 'Consider breaking work into smaller focused sessions'
        : 'Try extending your work sessions for deeper focus';

      insights.push({
        id: `session-duration-${Date.now()}`,
        type: 'optimization_suggestion',
        title: 'Session Duration Optimization',
        description: `Your average session length is ${avgDuration.toFixed(1)} hours. ${recommendation}`,
        confidence: 0.8,
        priority: avgDuration > 4 ? 'high' : 'medium',
        data: {
          averageDuration: avgDuration,
          optimalDuration,
          sessionDurations: durations,
        },
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private analyzeConsistency(sessions: any[]): AiInsight[] {
    const insights: AiInsight[] = [];
    
    // Group by day
    const dailyData: Record<string, number> = {};
    
    sessions.forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += (session.durationMinutes || 0) / 60;
    });

    const dailyHours = Object.values(dailyData);
    if (dailyHours.length < 7) return insights; // Need at least a week of data

    const avgHours = dailyHours.reduce((sum, h) => sum + h, 0) / dailyHours.length;
    const variance = dailyHours.reduce((sum, h) => sum + Math.pow(h - avgHours, 2), 0) / dailyHours.length;
    const stdDev = Math.sqrt(variance);

    const consistencyScore = Math.max(0, 100 - (stdDev / avgHours) * 100);

    insights.push({
      id: `consistency-${Date.now()}`,
      type: 'productivity_pattern',
      title: 'Work Consistency Score',
      description: `Your work consistency score is ${Math.round(consistencyScore)}%. ${consistencyScore > 80 ? 'Great consistency!' : consistencyScore > 60 ? 'Good consistency, but room for improvement' : 'Try to establish a more consistent work routine'}`,
      confidence: 0.85,
      priority: consistencyScore < 70 ? 'high' : 'low',
      data: {
        consistencyScore,
        dailyHours,
        averageHours: avgHours,
        standardDeviation: stdDev,
      },
      createdAt: new Date(),
    });

    return insights;
  }

  private detectAnomalies(sessions: any[]): AiInsight[] {
    const insights: AiInsight[] = [];
    
    // Find unusually long or short sessions
    const durations = sessions
      .filter(s => s.durationMinutes)
      .map(s => s.durationMinutes! / 60);
    
    if (durations.length < 10) return insights;

    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const stdDev = Math.sqrt(durations.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / durations.length);
    
    const outliers = sessions.filter(session => {
      if (!session.durationMinutes) return false;
      const duration = session.durationMinutes / 60;
      return Math.abs(duration - avg) > 2 * stdDev;
    });

    if (outliers.length > 0) {
      insights.push({
        id: `anomalies-${Date.now()}`,
        type: 'anomaly_detection',
        title: 'Unusual Work Patterns Detected',
        description: `Found ${outliers.length} sessions that deviate significantly from your normal pattern. These might indicate distractions or exceptional focus periods.`,
        confidence: 0.9,
        priority: 'medium',
        data: {
          outliers: outliers.map(o => ({
            id: o.id,
            duration: (o.durationMinutes || 0) / 60,
            date: new Date(o.startTime).toISOString().split('T')[0],
            project: o.project?.name,
          })),
          averageDuration: avg,
          threshold: 2 * stdDev,
        },
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private predictTrends(sessions: any[]): AiInsight[] {
    const insights: AiInsight[] = [];
    
    // Simple trend analysis - compare last week vs previous week
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const lastWeekSessions = sessions.filter(s => 
      new Date(s.startTime) >= lastWeek && new Date(s.startTime) < now
    );
    
    const previousWeekSessions = sessions.filter(s => 
      new Date(s.startTime) >= twoWeeksAgo && new Date(s.startTime) < lastWeek
    );

    const lastWeekHours = lastWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0) / 60, 0);
    const previousWeekHours = previousWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0) / 60, 0);

    if (previousWeekHours > 0) {
      const trend = ((lastWeekHours - previousWeekHours) / previousWeekHours) * 100;
      const direction = trend > 5 ? 'increasing' : trend < -5 ? 'decreasing' : 'stable';

      insights.push({
        id: `trend-${Date.now()}`,
        type: 'trend_prediction',
        title: 'Productivity Trend Analysis',
        description: `Your productivity is ${direction} by ${Math.abs(trend).toFixed(1)}% compared to last week. ${direction === 'increasing' ? 'Keep up the great work!' : direction === 'decreasing' ? 'Consider reviewing your work routine.' : 'Maintaining consistent performance.'}`,
        confidence: 0.75,
        priority: Math.abs(trend) > 10 ? 'high' : 'low',
        data: {
          trend,
          lastWeekHours,
          previousWeekHours,
          sessionsCount: {
            lastWeek: lastWeekSessions.length,
            previousWeek: previousWeekSessions.length,
          },
        },
        createdAt: new Date(),
      });
    }

    return insights;
  }

  async getPersonalizedRecommendations(userId: string, teamId?: string) {
    const insights = await this.generateProductivityInsights(userId, teamId);
    
    // Extract actionable recommendations
    const recommendations = insights
      .filter(insight => insight.type === 'optimization_suggestion')
      .map(insight => ({
        id: insight.id,
        title: insight.title,
        description: insight.description,
        priority: insight.priority,
        confidence: insight.confidence,
      }));

    return recommendations;
  }
}