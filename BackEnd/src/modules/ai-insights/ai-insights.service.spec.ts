import { Test, TestingModule } from '@nestjs/testing';
import { AiInsightsService } from './ai-insights.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AiInsightsService', () => {
  let service: AiInsightsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    session: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiInsightsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AiInsightsService>(AiInsightsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateProductivityInsights', () => {
    it('should generate insights for user sessions', async () => {
      const userId = 'user1';
      const sessions = [
        {
          id: 'session1',
          startTime: new Date('2024-01-01T09:00:00Z'),
          durationMinutes: 120,
          projectId: 'project1',
          project: { name: 'Project 1' },
        },
        {
          id: 'session2',
          startTime: new Date('2024-01-01T14:00:00Z'),
          durationMinutes: 180,
          projectId: 'project2',
          project: { name: 'Project 2' },
        },
      ];

      mockPrismaService.session.findMany.mockResolvedValue(sessions);

      const insights = await service.generateProductivityInsights(userId, undefined, 7);

      expect(insights).toBeInstanceOf(Array);
      expect(prisma.session.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          startTime: expect.any(Object),
        },
        include: {
          project: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      });
    });

    it('should return empty array for no sessions', async () => {
      const userId = 'user1';
      mockPrismaService.session.findMany.mockResolvedValue([]);

      const insights = await service.generateProductivityInsights(userId);

      expect(insights).toEqual([]);
    });
  });

  describe('getPersonalizedRecommendations', () => {
    it('should extract optimization suggestions', async () => {
      const userId = 'user1';
      const mockInsights = [
        {
          id: 'insight1',
          type: 'optimization_suggestion',
          title: 'Session Duration',
          description: 'Optimize session length',
          confidence: 0.8,
          priority: 'medium',
          data: {},
          createdAt: new Date(),
        },
        {
          id: 'insight2',
          type: 'productivity_pattern',
          title: 'Peak Hours',
          description: 'Morning productivity',
          confidence: 0.9,
          priority: 'high',
          data: {},
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'generateProductivityInsights').mockResolvedValue(mockInsights as any);

      const recommendations = await service.getPersonalizedRecommendations(userId);

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].title).toBe('Session Duration');
    });
  });
});