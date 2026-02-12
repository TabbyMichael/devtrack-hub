import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let prisma: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                {
                    provide: PrismaService,
                    useValue: {
                        session: {
                            findMany: jest.fn().mockResolvedValue([
                                { startTime: new Date('2024-02-12T10:00:00Z'), durationMinutes: 60 }
                            ]),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDailyTotals', () => {
        it('should return aggregated daily totals', async () => {
            const result = await service.getDailyTotals('user-1', '2024-02-01', '2024-02-28');
            expect(result).toHaveLength(1);
            expect(result[0].hours).toBe(1);
        });
    });
});
