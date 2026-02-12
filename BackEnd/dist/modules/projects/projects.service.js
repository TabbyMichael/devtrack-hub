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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.project.create({
            data: {
                ...dto,
                userId,
            },
            select: {
                id: true,
                name: true,
                color: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findAll(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100);
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where: {
                    userId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                    name: true,
                    color: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.project.count({
                where: {
                    userId,
                    deletedAt: null,
                },
            }),
        ]);
        return {
            data: projects,
            meta: {
                total,
                page,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }
    async findOne(userId, id) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                color: true,
                description: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this project');
        }
        const { userId: _, ...projectData } = project;
        return projectData;
    }
    async update(userId, id, dto) {
        await this.findOne(userId, id);
        return this.prisma.project.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                name: true,
                color: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        await this.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { message: 'Project deleted successfully' };
    }
    async restore(userId, id) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
            select: { deletedAt: true, userId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!project.deletedAt) {
            throw new common_1.BadRequestException('Project is not deleted');
        }
        return this.prisma.project.update({
            where: { id },
            data: { deletedAt: null },
            select: {
                id: true,
                name: true,
                color: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map