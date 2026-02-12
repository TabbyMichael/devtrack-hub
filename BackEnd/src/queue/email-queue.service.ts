import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface EmailJob {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
}

@Injectable()
export class EmailQueueService {
    constructor(
        @InjectQueue('email') private emailQueue: Queue,
    ) { }

    async sendWelcomeEmail(email: string, name: string) {
        await this.emailQueue.add('welcome', {
            to: email,
            subject: 'Welcome to DevTrack!',
            template: 'welcome',
            context: { name },
        });
    }

    async sendPasswordResetEmail(email: string, token: string, name: string) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.emailQueue.add(
            'password-reset',
            {
                to: email,
                subject: 'Reset Your Password',
                template: 'password-reset',
                context: { name, resetLink },
            },
            { priority: 1 }, // High priority
        );
    }

    async sendWeeklySummary(email: string, name: string, stats: any) {
        await this.emailQueue.add('weekly-summary', {
            to: email,
            subject: 'Your Weekly Summary',
            template: 'weekly-summary',
            context: { name, ...stats },
        });
    }
}
