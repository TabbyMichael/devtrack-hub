import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID'),
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const { id, emails, displayName, username } = profile;

        // Get primary email
        const email = emails?.[0]?.value;

        if (!email) {
            throw new Error('No email found in Github profile');
        }

        // Find or create user
        let user = await this.prisma.user.findUnique({
            where: { githubId: id },
        });

        if (!user) {
            // Check if email already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // Link GitHub account to existing user
                user = await this.prisma.user.update({
                    where: { email },
                    data: { githubId: id },
                });
            } else {
                // Create new user
                user = await this.prisma.user.create({
                    data: {
                        email,
                        githubId: id,
                        name: displayName || username,
                        password: null, // OAuth users don't have passwords
                    },
                });
            }
        }

        return user;
    }
}
