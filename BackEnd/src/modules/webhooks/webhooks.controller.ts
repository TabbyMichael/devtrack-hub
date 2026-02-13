import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { JwtAuthGuard } from '../auth/guards';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post(':teamId')
  @ApiOperation({ summary: 'Create a webhook for a team' })
  @ApiResponse({ status: 201, description: 'Webhook created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  create(
    @Request() req,
    @Param('teamId') teamId: string,
    @Body() createWebhookDto: CreateWebhookDto,
  ) {
    return this.webhooksService.create(req.user.id, teamId, createWebhookDto);
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get all webhooks for a team' })
  @ApiResponse({ status: 200, description: 'Webhooks retrieved successfully' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  findAll(@Request() req, @Param('teamId') teamId: string) {
    return this.webhooksService.findAll(teamId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific webhook' })
  @ApiResponse({ status: 200, description: 'Webhook retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @ApiParam({ name: 'id', description: 'Webhook ID' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.webhooksService.findOne(id, req.user.id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get webhook delivery logs' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @ApiParam({ name: 'id', description: 'Webhook ID' })
  getLogs(@Request() req, @Param('id') id: string) {
    return this.webhooksService.getWebhookLogs(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a webhook' })
  @ApiResponse({ status: 200, description: 'Webhook updated successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @ApiParam({ name: 'id', description: 'Webhook ID' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWebhookDto: UpdateWebhookDto,
  ) {
    return this.webhooksService.update(id, req.user.id, updateWebhookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook' })
  @ApiResponse({ status: 200, description: 'Webhook deleted successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  @ApiParam({ name: 'id', description: 'Webhook ID' })
  remove(@Request() req, @Param('id') id: string) {
    return this.webhooksService.remove(id, req.user.id);
  }
}