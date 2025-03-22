import { SetMetadata } from '@nestjs/common';
import { IPermission } from '../role/interfaces/permission';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (permissions: IPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
