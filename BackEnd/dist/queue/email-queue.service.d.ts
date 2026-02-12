import { Queue } from 'bull';
export interface EmailJob {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
}
export declare class EmailQueueService {
    private emailQueue;
    constructor(emailQueue: Queue);
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string, name: string): Promise<void>;
    sendWeeklySummary(email: string, name: string, stats: any): Promise<void>;
}
