import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreateProjectDto) {
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

    async findAll(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;
        const take = Math.min(limit, 100); // Max 100 items per page

        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where: {
                    userId,
                    deletedAt: null, // Only non-deleted projects
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

    async findOne(userId: string, id: string) {
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
            throw new NotFoundException('Project not found');
        }

        // Ownership check
        if (project.userId !== userId) {
            throw new ForbiddenException('You do not have access to this project');
        }

        // Remove userId from response
        const { userId: _, ...projectData } = project;
        return projectData;
    }

    async update(userId: string, id: string, dto: UpdateProjectDto) {
        // First check ownership
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

    async remove(userId: string, id: string) {
        // First check ownership
        await this.findOne(userId, id);

        // Soft delete
        await this.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'Project deleted successfully' };
    }

    async restore(userId: string, id: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
            select: { deletedAt: true, userId: true },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (!project.deletedAt) {
            throw new BadRequestException('Project is not deleted');
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
}
