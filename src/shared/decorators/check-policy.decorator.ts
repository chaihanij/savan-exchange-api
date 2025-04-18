import { SetMetadata } from '@nestjs/common';

export const CHECK_POLICY_KEY = 'check_policy';

export interface PolicyMetadata {
  action: string;
  resource: string;
}

export const CheckPolicy = (action: string, resource: string): MethodDecorator =>
  SetMetadata(CHECK_POLICY_KEY, { action, resource });
