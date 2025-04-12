import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountStatus, AccountTypeEnum } from '../../shared/interfaces';
import { CommonQueryDto } from '../../shared/dto/common-query.dto';

export class FilterAccountDto extends CommonQueryDto {
  @ApiPropertyOptional({ example: 'tenant-001' })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiPropertyOptional({ example: 'tenant-001' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ enum: AccountStatus, example: AccountStatus.Pending })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiPropertyOptional({ enum: AccountTypeEnum, example: AccountTypeEnum.Admin })
  @IsOptional()
  @IsEnum(AccountTypeEnum)
  accountType?: AccountTypeEnum;

  @ApiPropertyOptional({ example: 'google-oauth2-123456' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
