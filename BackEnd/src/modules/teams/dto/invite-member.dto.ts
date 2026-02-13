import { IsString, IsOptional } from 'class-validator';

export class InviteMemberDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  role?: string;
}