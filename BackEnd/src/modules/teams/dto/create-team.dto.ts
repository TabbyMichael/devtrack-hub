import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}