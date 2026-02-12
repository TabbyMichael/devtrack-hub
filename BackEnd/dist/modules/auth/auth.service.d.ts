import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly SALT_ROUNDS;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            preferences: import(".prisma/client").Prisma.JsonValue;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            preferences: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
        };
    }>;
    refreshTokens(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        preferences: import(".prisma/client").Prisma.JsonValue;
    }>;
    generateTokens(userId: string, email: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
