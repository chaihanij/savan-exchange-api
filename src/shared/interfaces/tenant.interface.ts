import { PlanTypeEnum } from './plan-type.enum';
import { TenantStatusEnum } from './tenant-status.enum';

export interface TenantInterface {
  _id?: string;
  tenantId: string;
  ownerId: string;
  name: string;
  description: string;
  slug: string;
  plan: PlanTypeEnum;
  status: TenantStatusEnum;
  trialEndsAt: Date;
  billingEmail: string;
  logoUrl: string;
  settings: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
