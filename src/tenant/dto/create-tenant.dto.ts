import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlanTypeEnum, TenantStatusEnum } from '../../shared/interfaces';

export class CreateTenantDto {
  @ApiProperty({ example: 'Savan Exchange' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'savan' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    example: 'Savan Exchange is a digital asset exchange.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '5e5933f6-8715-4cbe-9ce6-d55270b13dea' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ enum: PlanTypeEnum, example: PlanTypeEnum.Free })
  @IsOptional()
  @IsEnum(PlanTypeEnum)
  plan?: PlanTypeEnum;

  @ApiPropertyOptional({
    enum: TenantStatusEnum,
    example: TenantStatusEnum.Active,
  })
  @IsOptional()
  @IsEnum(TenantStatusEnum)
  status?: TenantStatusEnum;

  @ApiPropertyOptional({ example: '2025-04-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  trialEndsAt?: Date;

  @ApiPropertyOptional({ example: 'email@savan-exchange.com' })
  @IsOptional()
  @IsEmail()
  billingEmail?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '{"theme": "dark", "language": "en"}' })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
