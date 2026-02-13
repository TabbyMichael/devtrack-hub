import { IsString, IsArray, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { WebhookEvent, WebhookStatus } from '@prisma/client';

export class CreateWebhookDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  secret?: string;

  @IsArray()
  @IsEnum(WebhookEvent, { each: true })
  events: WebhookEvent[];

  @IsOptional()
  @IsEnum(WebhookStatus)
  status?: WebhookStatus;
}