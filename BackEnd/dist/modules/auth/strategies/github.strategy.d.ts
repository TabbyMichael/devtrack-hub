import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
declare const GithubStrategy_base: new (...args: [options: import("passport-github2").StrategyOptionsWithRequest] | [options: import("passport-github2").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GithubStrategy extends GithubStrategy_base {
    private readonly configService;
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<{
        id: string;
        email: string;
        password: string | null;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        preferences: import(".prisma/client").Prisma.JsonValue;
        githubId: string | null;
        googleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
