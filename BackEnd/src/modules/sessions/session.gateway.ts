import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

interface AuthenticatedSocket extends Socket {
    userId?: string;
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    },
    namespace: '/sessions',
})
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(SessionGateway.name);
    private connectedClients: Map<string, string> = new Map(); // userId -> socketId

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async afterInit(server: Server) {
        // Set up Redis adapter for multi-instance scaling
        const redisHost = this.configService.get('REDIS_HOST', 'localhost');
        const redisPort = this.configService.get('REDIS_PORT', 6379);
        const redisPassword = this.configService.get('REDIS_PASSWORD');

        try {
            const pubClient = createClient({
                socket: {
                    host: redisHost,
                    port: redisPort,
                },
                password: redisPassword || undefined,
            });

            const subClient = pubClient.duplicate();

            await Promise.all([pubClient.connect(), subClient.connect()]);

            server.adapter(createAdapter(pubClient, subClient));
            this.logger.log('✅ Socket.IO Redis adapter initialized');
        } catch (error) {
            this.logger.warn('⚠️  Redis adapter failed, running in single-instance mode:', error.message);
        }
    }

    async handleConnection(client: AuthenticatedSocket) {
        try {
            // Extract token from handshake
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

            if (!token) {
                throw new UnauthorizedException('Missing authentication token');
            }

            // Verify JWT
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // Attach userId to socket
            client.userId = payload.sub;

            // Store connection
            this.connectedClients.set(payload.sub, client.id);

            // Join user-specific room
            client.join(`user:${payload.sub}`);

            console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
        } catch (error) {
            console.error('WebSocket authentication failed:', error.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        if (client.userId) {
            this.connectedClients.delete(client.userId);
            console.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
        }
    }

    // Broadcast session started event
    emitSessionStarted(userId: string, session: any) {
        this.server.to(`user:${userId}`).emit('session:started', session);
    }

    // Broadcast session stopped event
    emitSessionStopped(userId: string, session: any) {
        this.server.to(`user:${userId}`).emit('session:stopped', session);
    }

    // Broadcast session paused event
    emitSessionPaused(userId: string, session: any) {
        this.server.to(`user:${userId}`).emit('session:paused', session);
    }

    // Broadcast session resumed event
    emitSessionResumed(userId: string, session: any) {
        this.server.to(`user:${userId}`).emit('session:resumed', session);
    }

    // Broadcast timer update (called periodically)
    emitTimerUpdate(userId: string, data: { sessionId: string; elapsedSeconds: number }) {
        this.server.to(`user:${userId}`).emit('timer:update', data);
    }

    // Get active connections count
    getActiveConnections(): number {
        return this.connectedClients.size;
    }

    // Check if user is connected
    isUserConnected(userId: string): boolean {
        return this.connectedClients.has(userId);
    }
}
