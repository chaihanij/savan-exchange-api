import { IsOptional, IsString } from 'class-validator';
import { PaginationSortOrderParams } from '../../helpers';
import { RoleSortOrder, RoleSortOrderKey } from './schemas/role.schema';
import { ApiProperty } from '@nestjs/swagger';

export class RoleQueryParam extends PaginationSortOrderParams {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The uuid of role',
    example: 'uuid',
    required: false,
  })
  uuid?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The name of role',
    example: 'name',
    required: false,
  })
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
}
