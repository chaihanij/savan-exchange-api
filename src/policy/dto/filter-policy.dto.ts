import { CommonQueryDto } from '../../shared/dto/common-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterPolicyDto extends CommonQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  policyId?: string;

  @ApiPropertyOptional({ example: 'tenant-001' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isSystemRole?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isDeleted?: boolean;
}
