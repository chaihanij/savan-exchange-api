import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IProfile } from '../../auth/interfaces';

export const ProfileDecorator = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as IProfile;
  },
);
