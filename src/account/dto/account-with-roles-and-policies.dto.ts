import { ApiProperty } from '@nestjs/swagger';
import { PolicyStatementEffectEnum } from '../../shared/interfaces';

export class PolicyStatementDto {
  @ApiProperty({ example: PolicyStatementEffectEnum.Allow, enum: PolicyStatementEffectEnum })
  effect: PolicyStatementEffectEnum;

  @ApiProperty({ example: ['read', 'write'] })
  action: string[];

  @ApiProperty({ example: ['resource1', 'resource2'] })
  resource: string[];

  @ApiProperty({ example: { stringEquals: { key: 'value' } }, required: false })
  condition?: Record<string, any>;
}

export class PolicyDto {
  @ApiProperty({ example: 'tenantId123' })
  tenantId: string;

  @ApiProperty({ example: 'policyId123' })
  policyId: string;

  @ApiProperty({ example: 'Policy Name' })
  name: string;

  @ApiProperty({ example: 'Policy Description', required: false })
  description?: string;

  @ApiProperty({ example: false })
  isSystemRole: boolean;

  @ApiProperty({ type: () => PolicyStatementDto, isArray: true })
  statements: PolicyStatementDto[];
}

export class RoleWithPoliciesDto {
  @ApiProperty({ example: 'tenantId123' })
  tenantId: string;

  @ApiProperty({ example: 'roleId123' })
  roleId: string;

  @ApiProperty({ example: 'Role Name' })
  name: string;

  @ApiProperty({ example: 'Role Description', required: false })
  description?: string;

  @ApiProperty({ example: false })
  isSystemRole: boolean;

  @ApiProperty({ type: () => PolicyDto, isArray: true })
  policies: PolicyDto[];
}

export class AccountWithRolesAndPoliciesDto {
  @ApiProperty({ example: 'tenantId123' })
  tenantId: string;

  @ApiProperty({ example: 'accountId123' })
  accountId: string;

  @ApiProperty({ example: 'username123' })
  username: string;

  @ApiProperty({ example: '<EMAIL>' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '1234567890' })
  phone: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatarUrl: string;

  @ApiProperty({ type: () => RoleWithPoliciesDto, isArray: true })
  roles: RoleWithPoliciesDto[];

  @ApiProperty({ type: () => PolicyDto, isArray: true })
  policies: PolicyDto[];
}
