import { AccountTypeEnum } from '../../shared/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ example: 'role-123' })
  roleId: string;

  @ApiProperty({ example: 'tenant-001' })
  tenantId: string;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ example: 'Administrator role with full access', required: false })
  description?: string;

  @ApiProperty({ example: false })
  isSystemRole: boolean;

  @ApiProperty({
    example: ['policy-id01', 'policy-id02'],
    isArray: true,
    type: String,
  })
  policyIds: string[];

  @ApiProperty({
    example: [AccountTypeEnum.Admin, AccountTypeEnum.Root],
    enum: AccountTypeEnum,
    isArray: true,
  })
  assignableTo: AccountTypeEnum[];

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z', required: false })
  updatedAt?: Date;
}
