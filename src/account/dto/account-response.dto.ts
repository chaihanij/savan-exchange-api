import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, AccountTypeEnum, ProviderEnum } from '../../shared/interfaces';

export class AccountResponseDto {
  @ApiProperty({ example: 'acc-123' })
  accountId: string;

  @ApiProperty({ example: 'tenant-001' })
  tenantId: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ enum: AccountTypeEnum, example: AccountTypeEnum.Customer })
  accountType: AccountTypeEnum;

  @ApiProperty({ example: true })
  isEmailVerified: boolean;

  @ApiProperty({ example: false })
  twoFactorEnabled: boolean;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.Active })
  status: AccountStatus;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({ example: '+11234567890' })
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Apt 456' })
  addressLine2?: string;

  @ApiProperty({ enum: ProviderEnum, example: ProviderEnum.Local })
  provider: ProviderEnum;

  @ApiPropertyOptional({ example: 'google-oauth2-123456' })
  providerId?: string;

  @ApiPropertyOptional({ example: '2025-04-01T08:00:00.000Z' })
  lastLoginAt?: Date;

  @ApiProperty({ example: ['role-1', 'role-2'] })
  roleIds: string[];

  @ApiProperty({ example: ['policy-1', 'policy-2'] })
  policyIds: string[];

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2025-04-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z' })
  updatedAt: Date;
}
