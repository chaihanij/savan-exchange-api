import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccountWithRolesAndPoliciesDto } from '../../account/dto';

export const AccountDecorator = createParamDecorator(
  (_: undefined, context: ExecutionContext): AccountWithRolesAndPoliciesDto => {
    const request = context.switchToHttp().getRequest();
    return request.user as AccountWithRolesAndPoliciesDto;
  },
);
