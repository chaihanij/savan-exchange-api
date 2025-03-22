import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrgDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'บ้านฟ้า',
    description: 'The name of org',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'address',
    description: 'The address of org',
  })
  address?: string;
}
