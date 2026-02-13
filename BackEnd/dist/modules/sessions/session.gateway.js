"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SessionGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
let SessionGateway = SessionGateway_1 = class SessionGateway {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(SessionGateway_1.name);
        this.connectedClients = new Map();
    }
    async afterInit(server) {
        const redisHost = this.configService.get('REDIS_HOST', 'localhost');
        const redisPort = this.configService.get('REDIS_PORT', 6379);
        const redisPassword = this.configService.get('REDIS_PASSWORD');
        try {
            const pubClient = (0, redis_1.createClient)({
                socket: {
                    host: redisHost,
                    port: redisPort,
                },
                password: redisPassword || undefined,
            });
            const subClient = pubClient.duplicate();
            await Promise.all([pubClient.connect(), subClient.connect()]);
            server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            this.logger.log('✅ Socket.IO Redis adapter initialized');
        }
        catch (error) {
            this.logger.warn('⚠️  Redis adapter failed, running in single-instance mode:', error.message);
        }
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                throw new common_1.UnauthorizedException('Missing authentication token');
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            client.userId = payload.sub;
            this.connectedClients.set(payload.sub, client.id);
            client.join(`user:${payload.sub}`);
            console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
        }
        catch (error) {
            console.error('WebSocket authentication failed:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.connectedClients.delete(client.userId);
            console.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
        }
    }
    emitSessionStarted(userId, session) {
        this.server.to(`user:${userId}`).emit('session:started', session);
    }
    emitSessionStopped(userId, session) {
        this.server.to(`user:${userId}`).emit('session:stopped', session);
    }
    emitSessionPaused(userId, session) {
        this.server.to(`user:${userId}`).emit('session:paused', session);
    }
    emitSessionResumed(userId, session) {
        this.server.to(`user:${userId}`).emit('session:resumed', session);
    }
    emitTimerUpdate(userId, data) {
        this.server.to(`user:${userId}`).emit('timer:update', data);
    }
    getActiveConnections() {
        return this.connectedClients.size;
    }
    isUserConnected(userId) {
        return this.connectedClients.has(userId);
    }
};
exports.SessionGateway = SessionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SessionGateway.prototype, "server", void 0);
exports.SessionGateway = SessionGateway = SessionGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true,
        },
        namespace: '/sessions',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], SessionGateway);
//# sourceMappingURL=session.gateway.js.map