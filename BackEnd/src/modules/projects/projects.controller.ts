import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Projects')
@Controller({ path: 'projects', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'Project created successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@GetUser('id') userId: string, @Body() dto: CreateProjectDto) {
        return this.projectsService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user projects' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
    findAll(
        @GetUser('id') userId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.projectsService.findAll(userId, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a project by ID' })
    @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findOne(@GetUser('id') userId: string, @Param('id') id: string) {
        return this.projectsService.findOne(userId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    @ApiResponse({ status: 200, description: 'Project updated successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    update(
        @GetUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.update(userId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a project' })
    @ApiResponse({ status: 200, description: 'Project deleted successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    remove(@GetUser('id') userId: string, @Param('id') id: string) {
        return this.projectsService.remove(userId, id);
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore a soft-deleted project' })
    @ApiResponse({ status: 200, description: 'Project restored successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    @ApiResponse({ status: 400, description: 'Project is not deleted' })
    restore(@GetUser('id') userId: string, @Param('id') id: string) {
        return this.projectsService.restore(userId, id);
    }
}
