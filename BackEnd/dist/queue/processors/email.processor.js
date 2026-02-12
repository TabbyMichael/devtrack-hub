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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor {
    constructor() {
        this.logger = new common_1.Logger(EmailProcessor_1.name);
        this.templates = new Map();
        this.transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        this.loadTemplate('welcome');
        this.loadTemplate('password-reset');
        this.loadTemplate('weekly-summary');
    }
    loadTemplate(name) {
        try {
            const templatePath = path.join(__dirname, '..', 'templates', `${name}.hbs`);
            if (fs.existsSync(templatePath)) {
                const source = fs.readFileSync(templatePath, 'utf-8');
                this.templates.set(name, handlebars.compile(source));
            }
            else {
                this.templates.set(name, handlebars.compile(`<p>{{message}}</p>`));
            }
        }
        catch (error) {
            this.logger.error(`Failed to load template ${name}:`, error);
        }
    }
    async sendWelcomeEmail(job) {
        return this.sendEmail(job.data);
    }
    async sendPasswordResetEmail(job) {
        return this.sendEmail(job.data);
    }
    async sendWeeklySummaryEmail(job) {
        return this.sendEmail(job.data);
    }
    async sendEmail(data) {
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
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${data.to}:`, error);
            throw error;
        }
    }
};
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)('welcome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "sendWelcomeEmail", null);
__decorate([
    (0, bull_1.Process)('password-reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "sendPasswordResetEmail", null);
__decorate([
    (0, bull_1.Process)('weekly-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "sendWeeklySummaryEmail", null);
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bull_1.Processor)('email'),
    __metadata("design:paramtypes", [])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map