import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanTypeEnum, TenantInterface, TenantStatusEnum } from '../../shared/interfaces';

export class TenantResponseDto implements TenantInterface {
  @ApiProperty({ example: '5e5933f6-8715-4cbe-9ce6-d55270b13dea' })
  tenantId: string;

  @ApiPropertyOptional({ example: '5e5933f6-8715-4cbe-9ce6-d55270b13dea' })
  ownerId: string;

  @ApiProperty({ example: 'Savan Exchange' })
  name: string;

  @ApiProperty({ example: 'savan' })
  slug: string;

  @ApiPropertyOptional({ example: 'Savan Exchange is a digital asset exchange.' })
  description: string;

  @ApiProperty({ example: PlanTypeEnum.Free, enum: PlanTypeEnum })
  plan: PlanTypeEnum;

  @ApiProperty({ example: TenantStatusEnum.Active, enum: TenantStatusEnum })
  status: TenantStatusEnum;

  @ApiPropertyOptional({ example: '2025-04-10T00:00:00.000Z' })
  trialEndsAt: Date;

  @ApiPropertyOptional({ example: 'email@savan-exchange.com' })
  billingEmail: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logoUrl: string;

  @ApiPropertyOptional({ example: '{"theme": "dark", "language": "en"}' })
  settings: Record<string, any>;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2025-04-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z' })
  updatedAt: Date;
}
