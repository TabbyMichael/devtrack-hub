import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class StopSessionDto {
    @ApiProperty({
        example: 'Completed feature implementation and code review',
        description: 'Session notes (optional, max 2000 characters)',
        maxLength: 2000,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Notes must be a string' })
    @MaxLength(2000, { message: 'Notes must not exceed 2000 characters' })
    notes?: string;
}
