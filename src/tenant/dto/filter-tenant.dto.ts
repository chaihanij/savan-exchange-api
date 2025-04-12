import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PlanTypeEnum, TenantStatusEnum } from '../../shared/interfaces';
import { CommonQueryDto } from '../../shared/dto/common-query.dto';

export class FilterTenantDto extends CommonQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ enum: PlanTypeEnum })
  @IsOptional()
  @IsEnum(PlanTypeEnum)
  plan?: PlanTypeEnum;

  @ApiPropertyOptional({ enum: TenantStatusEnum })
  @IsOptional()
  @IsEnum(TenantStatusEnum)
  status?: TenantStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
