import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController', () => {
    let controller: HealthController;
    let prisma: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: PrismaService,
                    useValue: {
                        $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
                    },
                },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should return health status', async () => {
        const result = await controller.check();
        expect(result.status).toBe('ok');
        expect(result.database).toBe('connected');
    });
});
