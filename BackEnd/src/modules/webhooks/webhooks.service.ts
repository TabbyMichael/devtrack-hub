import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookEvent, WebhookStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, teamId: string, dto: CreateWebhookDto) {
    // Verify user has permission to create webhook for this team
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User is not a member of this team');
    }

    // Check if webhook URL already exists for this team
    const existingWebhook = await this.prisma.webhook.findFirst({
      where: {
        url: dto.url,
        teamId,
      },
    });

    if (existingWebhook) {
      throw new BadRequestException('Webhook URL already exists for this team');
    }

    const webhook = await this.prisma.webhook.create({
      data: {
        name: dto.name,
        url: dto.url,
        secret: dto.secret,
        events: dto.events,
        teamId,
        createdBy: userId,
      },
    });

    this.logger.log(`Webhook created: ${webhook.id} for team ${teamId}`);
    return webhook;
  }

  async findAll(teamId: string, userId: string) {
    // Verify user has permission to view webhooks for this team
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User is not a member of this team');
    }

    return this.prisma.webhook.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    // Verify user has permission to access this webhook
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: webhook.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User does not have access to this webhook');
    }

    return webhook;
  }

  async update(id: string, userId: string, dto: UpdateWebhookDto) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    // Verify user has permission to update this webhook
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: webhook.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User does not have access to this webhook');
    }

    const updatedWebhook = await this.prisma.webhook.update({
      where: { id },
      data: {
        name: dto.name,
        url: dto.url,
        secret: dto.secret,
        events: dto.events,
        status: dto.status,
      },
    });

    this.logger.log(`Webhook updated: ${id}`);
    return updatedWebhook;
  }

  async remove(id: string, userId: string) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    // Verify user has permission to delete this webhook
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: webhook.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User does not have access to this webhook');
    }

    await this.prisma.webhook.delete({
      where: { id },
    });

    this.logger.log(`Webhook deleted: ${id}`);
  }

  async triggerWebhook(event: WebhookEvent, data: any, teamId: string) {
    // Find all active webhooks for this team that subscribe to this event
    const webhooks = await this.prisma.webhook.findMany({
      where: {
        teamId,
        status: WebhookStatus.ACTIVE,
        events: {
          has: event,
        },
      },
    });

    if (webhooks.length === 0) {
      return;
    }

    // Emit event for processing
    this.eventEmitter.emit('webhook.trigger', {
      event,
      data,
      webhooks,
    });
  }

  async getWebhookLogs(webhookId: string, userId: string) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    // Verify user has permission to access this webhook
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: webhook.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User does not have access to this webhook');
    }

    return this.prisma.webhookLog.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 logs
    });
  }
}