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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
let EmailQueueService = class EmailQueueService {
    constructor(emailQueue) {
        this.emailQueue = emailQueue;
    }
    async sendWelcomeEmail(email, name) {
        await this.emailQueue.add('welcome', {
            to: email,
            subject: 'Welcome to DevTrack!',
            template: 'welcome',
            context: { name },
        });
    }
    async sendPasswordResetEmail(email, token, name) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.emailQueue.add('password-reset', {
            to: email,
            subject: 'Reset Your Password',
            template: 'password-reset',
            context: { name, resetLink },
        }, { priority: 1 });
    }
    async sendWeeklySummary(email, name, stats) {
        await this.emailQueue.add('weekly-summary', {
            to: email,
            subject: 'Your Weekly Summary',
            template: 'weekly-summary',
            context: { name, ...stats },
        });
    }
};
exports.EmailQueueService = EmailQueueService;
exports.EmailQueueService = EmailQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [Object])
], EmailQueueService);
//# sourceMappingURL=email-queue.service.js.map