import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class StartSessionDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Project ID to associate with this session',
    })
    @IsUUID('4', { message: 'Project ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Project ID is required' })
    projectId: string;
}
