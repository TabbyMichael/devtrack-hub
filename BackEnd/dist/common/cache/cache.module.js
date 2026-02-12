"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConfigModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
let CacheConfigModule = class CacheConfigModule {
};
exports.CacheConfigModule = CacheConfigModule;
exports.CacheConfigModule = CacheConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    try {
                        const store = await (0, cache_manager_redis_yet_1.redisStore)({
                            socket: {
                                host: configService.get('REDIS_HOST', 'localhost'),
                                port: configService.get('REDIS_PORT', 6379),
                            },
                            password: configService.get('REDIS_PASSWORD') || undefined,
                        });
                        return { store, ttl: 300000 };
                    }
                    catch (error) {
                        console.warn('⚠️  Redis cache failed, falling back to in-memory store:', error.message);
                        return { ttl: 300000 };
                    }
                },
                inject: [config_1.ConfigService],
                isGlobal: true,
            }),
        ],
    })
], CacheConfigModule);
//# sourceMappingURL=cache.module.js.map