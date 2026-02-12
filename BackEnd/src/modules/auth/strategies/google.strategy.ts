import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        const { id, emails, displayName } = profile;

        // Get primary email
        const email = emails?.[0]?.value;

        if (!email) {
            return done(new Error('No email found in Google profile'), null);
        }

        try {
            // Find or create user
            let user = await this.prisma.user.findUnique({
                where: { googleId: id },
            });

            if (!user) {
                // Check if email already exists
                const existingUser = await this.prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    // Link Google account to existing user
                    user = await this.prisma.user.update({
                        where: { email },
                        data: { googleId: id },
                    });
                } else {
                    // Create new user
                    user = await this.prisma.user.create({
                        data: {
                            email,
                            googleId: id,
                            name: displayName,
                            password: null, // OAuth users don't have passwords
                        },
                    });
                }
            }

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
}
