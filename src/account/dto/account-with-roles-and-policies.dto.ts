export class PolicyStatementDto {
  effect: string;
  action: string[];
  resource: string[];
  condition?: Record<string, any>;
}

export class PolicyDto {
  tenantId: string;
  policyId: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  statements: PolicyStatementDto[];
}

export class RoleWithPoliciesDto {
  tenantId: string;
  roleId: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  policies: PolicyDto[];
}

export class AccountWithRolesAndPoliciesDto {
  tenantId: string;
  accountId: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  roles: RoleWithPoliciesDto[];
  policies: PolicyDto[];
}
