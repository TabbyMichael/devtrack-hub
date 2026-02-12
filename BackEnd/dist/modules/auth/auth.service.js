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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.SALT_ROUNDS = 12;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                preferences: true,
                createdAt: true,
            },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user,
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                preferences: user.preferences,
                createdAt: user.createdAt,
            },
            ...tokens,
        };
    }
    async refreshTokens(dto) {
        try {
            const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const tokenRecord = await this.prisma.refreshToken.findUnique({
                where: { token: dto.refreshToken },
            });
            if (!tokenRecord || tokenRecord.revoked) {
                throw new common_1.UnauthorizedException('Invalid or revoked refresh token');
            }
            await this.prisma.refreshToken.update({
                where: { token: dto.refreshToken },
                data: { revoked: true },
            });
            const tokens = await this.generateTokens(payload.sub, payload.email, payload.role);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(refreshToken) {
        try {
            await this.prisma.refreshToken.updateMany({
                where: { token: refreshToken },
                data: { revoked: true },
            });
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to logout');
        }
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                preferences: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
            }),
        ]);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map