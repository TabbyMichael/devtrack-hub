import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    Matches,
    IsOptional,
} from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        example: 'Mobile App Development',
        description: 'Project name',
        minLength: 1,
        maxLength: 100,
    })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(1, { message: 'Name must have at least 1 character' })
    @MaxLength(100, { message: 'Name must not exceed 100 characters' })
    name: string;

    @ApiProperty({
        example: '#3B82F6',
        description: 'Project color (hex format: #RRGGBB or HSLA format)',
        pattern: '^(#[0-9A-Fa-f]{6}|hsla?\\(\\d+,\\s*\\d+%,\\s*\\d+%(,\\s*[0-9.]+)?\\))$',
    })
    @IsString({ message: 'Color must be a string' })
    @IsNotEmpty({ message: 'Color is required' })
    @Matches(/^(#[0-9A-Fa-f]{6}|hsla?\(\d+,\s*\d+%,\s*\d+%(,\s*[0-9.]+)?\))$/, {
        message: 'Color must be a valid hex (#RRGGBB) or HSLA format',
    })
    color: string;

    @ApiProperty({
        example: 'Building a cross-platform mobile application',
        description: 'Project description (optional)',
        maxLength: 500,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MaxLength(500, { message: 'Description must not exceed 500 characters' })
    description?: string;
}
