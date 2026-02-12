import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                try {
                    const store = await redisStore({
                        socket: {
                            host: configService.get('REDIS_HOST', 'localhost'),
                            port: configService.get('REDIS_PORT', 6379),
                        },
                        password: configService.get('REDIS_PASSWORD') || undefined,
                    });
                    return { store, ttl: 300000 };
                } catch (error) {
                    console.warn('⚠️  Redis cache failed, falling back to in-memory store:', error.message);
                    return { ttl: 300000 }; // Default in-memory store
                }
            },
            inject: [ConfigService],
            isGlobal: true,
        }),
    ],
})
export class CacheConfigModule { }
