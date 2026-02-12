import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { EmailJob } from '../email-queue.service';

@Processor('email')
export class EmailProcessor {
    private readonly logger = new Logger(EmailProcessor.name);
    private transporter: nodemailer.Transporter;
    private templates: Map<string, handlebars.TemplateDelegate> = new Map();

    constructor() {
        // Initialize nodemailer transporter
        this.transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Load email templates
        this.loadTemplate('welcome');
        this.loadTemplate('password-reset');
        this.loadTemplate('weekly-summary');
    }

    private loadTemplate(name: string) {
        try {
            const templatePath = path.join(__dirname, '..', 'templates', `${name}.hbs`);
            if (fs.existsSync(templatePath)) {
                const source = fs.readFileSync(templatePath, 'utf-8');
                this.templates.set(name, handlebars.compile(source));
            } else {
                // Fallback to simple text template
                this.templates.set(name, handlebars.compile(`<p>{{message}}</p>`));
            }
        } catch (error) {
            this.logger.error(`Failed to load template ${name}:`, error);
        }
    }

    @Process('welcome')
    async sendWelcomeEmail(job: Job<EmailJob>) {
        return this.sendEmail(job.data);
    }

    @Process('password-reset')
    async sendPasswordResetEmail(job: Job<EmailJob>) {
        return this.sendEmail(job.data);
    }

    @Process('weekly-summary')
    async sendWeeklySummaryEmail(job: Job<EmailJob>) {
        return this.sendEmail(job.data);
    }

    private async sendEmail(data: EmailJob) {
        try {
            const template = this.templates.get(data.template);
            const html = template ? template(data.context) : `<p>${data.subject}</p>`;

            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"DevTrack" <noreply@devtrack.com>',
                to: data.to,
                subject: data.subject,
                html,
            });

            this.logger.log(`Email sent: ${info.messageId} to ${data.to}`);
            return info;
        } catch (error) {
            this.logger.error(`Failed to send email to ${data.to}:`, error);
            throw error; // Will trigger retry
        }
    }
}
