import { AccountTypeEnum } from './account-type.enum';
import { AccountStatus } from './account-status.enum';
import { ProviderEnum } from './provider.enum';

export interface AccountInterface {
  _id?: string;
  accountId: string;
  tenantId: string;
  accountType: AccountTypeEnum;
  username: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  status: AccountStatus;
  deletedAt: Date;
  name: string;
  phone: string;
  avatarUrl: string;
  addressLine1: string;
  addressLine2: string;
  provider: ProviderEnum;
  providerId: string;
  lastLoginAt: Date;
  roleIds: string[];
  policyIds: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
