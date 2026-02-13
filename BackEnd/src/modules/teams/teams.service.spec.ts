import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    team: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    teamMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    project: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new team successfully', async () => {
      const createDto = {
        name: 'Test Team',
        slug: 'test-team',
        description: 'A test team',
      };

      mockPrismaService.team.findUnique.mockResolvedValue(null);
      mockPrismaService.team.create.mockResolvedValue({
        id: '1',
        ...createDto,
        members: [{
          userId: 'user-1',
          role: 'OWNER',
          user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
        }],
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.create('user-1', createDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Test Team');
      expect(result).toHaveProperty('slug', 'test-team');
      expect(mockPrismaService.team.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return teams for the user', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Team 1',
          slug: 'team-1',
          members: [],
          _count: { members: 1, projects: 2 },
        },
        {
          id: '2',
          name: 'Team 2',
          slug: 'team-2',
          members: [],
          _count: { members: 3, projects: 1 },
        },
      ];

      mockPrismaService.team.findMany.mockResolvedValue(mockTeams);

      const result = await service.findAll('user-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('name', 'Team 1');
      expect(result[1]).toHaveProperty('name', 'Team 2');
    });
  });

  describe('findOne', () => {
    it('should return a team when user is member', async () => {
      const mockTeam = {
        id: '1',
        name: 'Test Team',
        slug: 'test-team',
        members: [{ userId: 'user-1' }],
        projects: [],
        _count: { members: 1, projects: 0 },
      };

      mockPrismaService.team.findUnique.mockResolvedValue(mockTeam);

      const result = await service.findOne('user-1', '1');

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name', 'Test Team');
    });

    it('should throw NotFoundException when team not found', async () => {
      mockPrismaService.team.findUnique.mockResolvedValue(null);

      await expect(service.findOne('user-1', '999')).rejects.toThrow('Team not found');
    });

    it('should throw ForbiddenException when user is not member', async () => {
      const mockTeam = {
        id: '1',
        name: 'Test Team',
        slug: 'test-team',
        members: [{ userId: 'user-2' }], // Different user
        projects: [],
        _count: { members: 1, projects: 0 },
      };

      mockPrismaService.team.findUnique.mockResolvedValue(mockTeam);

      await expect(service.findOne('user-1', '1')).rejects.toThrow('You are not a member of this team');
    });
  });
});