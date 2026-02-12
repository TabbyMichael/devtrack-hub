import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
interface AuthenticatedSocket extends Socket {
    userId?: string;
}
export declare class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(jwtService: JwtService, configService: ConfigService);
    afterInit(server: Server): Promise<void>;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    emitSessionStarted(userId: string, session: any): void;
    emitSessionStopped(userId: string, session: any): void;
    emitTimerUpdate(userId: string, data: {
        sessionId: string;
        elapsedSeconds: number;
    }): void;
    getActiveConnections(): number;
    isUserConnected(userId: string): boolean;
}
export {};
