import { PolicyStatementEffectEnum } from './policy-statement-effect.enum';

export interface PolicyStatementInterface {
  effect: PolicyStatementEffectEnum;
  action: string[];
  resource: string[];
  condition?: {
    stringEquals?: Record<string, string>;
    stringLike?: Record<string, string>;
    stringEqualsIfExists?: Record<string, string>;
    stringLikeIfExists?: Record<string, string>;
  };
}

export interface PolicyInterface {
  _id?: string;
  tenantId: string;
  policyId: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  statements: any;
  createdAt?: Date;
  updatedAt?: Date;
}
