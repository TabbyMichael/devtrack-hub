import { Job } from 'bull';
import { EmailJob } from '../email-queue.service';
export declare class EmailProcessor {
    private readonly logger;
    private transporter;
    private templates;
    constructor();
    private loadTemplate;
    sendWelcomeEmail(job: Job<EmailJob>): Promise<any>;
    sendPasswordResetEmail(job: Job<EmailJob>): Promise<any>;
    sendWeeklySummaryEmail(job: Job<EmailJob>): Promise<any>;
    private sendEmail;
}
