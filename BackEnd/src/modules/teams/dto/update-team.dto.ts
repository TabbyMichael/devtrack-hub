import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}