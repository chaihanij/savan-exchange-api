import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountStatus, AccountTypeEnum, ProviderEnum } from '../../shared/interfaces';

export class CreateAccountDto {
  @ApiProperty({ example: 'tenant-001' })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ example: 'john.doe' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'plain-password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'hashed-password' })
  @IsString()
  passwordHash?: string;

  @ApiPropertyOptional({ enum: AccountTypeEnum, example: AccountTypeEnum.Customer })
  @IsOptional()
  @IsEnum(AccountTypeEnum)
  accountType?: AccountTypeEnum;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({ enum: AccountStatus, example: AccountStatus.Active })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+11234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Apt 456' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ enum: ProviderEnum, example: ProviderEnum.Local })
  @IsOptional()
  @IsEnum(ProviderEnum)
  provider?: ProviderEnum;

  @ApiPropertyOptional({ example: 'google-oauth2-123456' })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiPropertyOptional({ example: '2025-04-01T08:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;

  @ApiPropertyOptional({ example: ['role-1', 'role-2'] })
  @IsOptional()
  @IsArray()
  roleIds?: string[];

  @ApiPropertyOptional({ example: ['policy-1', 'policy-2'] })
  @IsOptional()
  @IsArray()
  policyIds?: string[];
}
