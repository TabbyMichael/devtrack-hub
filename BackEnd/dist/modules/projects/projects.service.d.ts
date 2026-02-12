import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        color: string;
    }>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            color: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        color: string;
    }>;
    update(userId: string, id: string, dto: UpdateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        color: string;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    restore(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        color: string;
    }>;
}
