import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export interface IPermission {
  resource: Resource;
  actions: Action[];
}
