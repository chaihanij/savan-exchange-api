import { IsOptional, IsString } from 'class-validator';
import { PaginationSortOrderParams } from '../../helpers';
import { OrgSortOrder, OrgSortOrderKey } from './schemas/org.schema';

export class OrgQueryParam extends PaginationSortOrderParams {
  @IsString()
  @IsOptional()
  uuid?: string;

  @IsString()
  @IsOptional()
  name?: string;

  getOrgSortOrder(): OrgSortOrder | undefined {
    const sortOrder = this.getSortOrder();
    if (!sortOrder) return undefined;
    const orgSortOrder: OrgSortOrder = {};
    for (const key of OrgSortOrderKey) {
      if (sortOrder[key]) {
        orgSortOrder[key] = sortOrder[key];
      }
    }
    return orgSortOrder;
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
