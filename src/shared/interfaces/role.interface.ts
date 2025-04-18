import { AccountTypeEnum } from './account-type.enum';

export interface RoleInterface {
  _id?: string;
  roleId: string;
  tenantId: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  policyIds: string[];
  assignableTo: AccountTypeEnum[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
