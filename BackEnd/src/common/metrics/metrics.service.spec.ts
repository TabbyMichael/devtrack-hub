import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { getToken } from '@willsoto/nestjs-prometheus';

describe('MetricsService', () => {
    let service: MetricsService;
    let mockHttpRequestsTotal: any;

    beforeEach(async () => {
        mockHttpRequestsTotal = { inc: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MetricsService,
                {
                    provide: getToken('http_requests_total'),
                    useValue: mockHttpRequestsTotal,
                },
                {
                    provide: getToken('http_request_duration_seconds'),
                    useValue: { observe: jest.fn() },
                },
                {
                    provide: getToken('active_sessions'),
                    useValue: { set: jest.fn() },
                },
                {
                    provide: getToken('total_users'),
                    useValue: { set: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<MetricsService>(MetricsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should increment http requests count', () => {
        service.incrementHttpRequests('GET', '/test', 200);
        expect(mockHttpRequestsTotal.inc).toHaveBeenCalledWith({
            method: 'GET',
            route: '/test',
            status_code: 200,
        });
    });
});
