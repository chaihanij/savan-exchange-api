import { CommonQueryDto } from '../../shared/dto/common-query.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterRoleDto extends CommonQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isSystemRole: boolean;
}
