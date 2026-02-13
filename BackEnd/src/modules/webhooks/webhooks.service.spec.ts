import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebhookEvent } from '@prisma/client';

describe('WebhooksService', () => {
  let service: WebhooksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    webhook: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    teamMember: {
      findUnique: jest.fn(),
    },
    webhookLog: {
      findMany: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a webhook', async () => {
      const userId = 'user1';
      const teamId = 'team1';
      const dto = {
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: [WebhookEvent.SESSION_STARTED],
      };

      mockPrismaService.teamMember.findUnique.mockResolvedValue({ userId, teamId });
      mockPrismaService.webhook.findFirst.mockResolvedValue(null);
      mockPrismaService.webhook.create.mockResolvedValue({
        id: 'webhook1',
        ...dto,
        teamId,
        createdBy: userId,
      });

      const result = await service.create(userId, teamId, dto);

      expect(result).toEqual({
        id: 'webhook1',
        ...dto,
        teamId,
        createdBy: userId,
      });
      expect(prisma.webhook.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          url: dto.url,
          secret: undefined,
          events: dto.events,
          teamId,
          createdBy: userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all webhooks for a team', async () => {
      const teamId = 'team1';
      const userId = 'user1';
      const webhooks = [
        { id: 'webhook1', name: 'Webhook 1' },
        { id: 'webhook2', name: 'Webhook 2' },
      ];

      mockPrismaService.teamMember.findUnique.mockResolvedValue({ userId, teamId });
      mockPrismaService.webhook.findMany.mockResolvedValue(webhooks);

      const result = await service.findAll(teamId, userId);

      expect(result).toEqual(webhooks);
      expect(prisma.webhook.findMany).toHaveBeenCalledWith({
        where: { teamId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});