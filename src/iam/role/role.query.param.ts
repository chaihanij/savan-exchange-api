import { IsOptional, IsString } from 'class-validator';
import { PaginationSortOrderParams } from '../../helpers';
import { RoleSortOrder, RoleSortOrderKey } from './schemas/role.schema';

export class RoleQueryParam extends PaginationSortOrderParams {
  @IsString()
  @IsOptional()
  uuid?: string;

  @IsString()
  @IsOptional()
  name?: string;

  getRoleSortOrder(): RoleSortOrder | undefined {
    const sortOrder = this.getSortOrder();
    if (!sortOrder) return undefined;
    const roleSortOrder: RoleSortOrder = {};
    for (const key of RoleSortOrderKey) {
      if (sortOrder[key]) {
        roleSortOrder[key] = sortOrder[key];
      }
    }
    return roleSortOrder;
  }

  getFilter(): Record<string, any> {
    const filter: Record<string, any> = {};
    for (const key of Object.keys(this)) {
      if (this[key] !== undefined) {
        filter[key] = this[key];
      }
    }
    return filter;
  }
}
