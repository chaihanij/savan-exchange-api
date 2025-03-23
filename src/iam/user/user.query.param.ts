import { IsOptional, IsString } from 'class-validator';
import { PaginationSortOrderParams } from '../../helpers';
import { UserSortOrder, UserSortOrderKey } from './schemas/user.schema';

export class UserQueryParam extends PaginationSortOrderParams {
  @IsString()
  @IsOptional()
  uuid?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  accountType?: number;

  @IsString()
  @IsOptional()
  orgUuid?: string;

  getUserSortOrder(): UserSortOrder | undefined {
    const sortOrder = this.getSortOrder();
    if (!sortOrder) return undefined;
    const userSortOrder: UserSortOrder = {};
    for (const key of UserSortOrderKey) {
      if (sortOrder[key]) {
        userSortOrder[key] = sortOrder[key];
      }
    }
    return userSortOrder;
  }
}
