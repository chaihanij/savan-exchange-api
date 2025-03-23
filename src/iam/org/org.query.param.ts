import { IsOptional, IsString } from 'class-validator';
import { PaginationSortOrderParams } from '../../helpers';
import { OrgSortOrder, OrgSortOrderKey } from './schemas/org.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrgQueryParam extends PaginationSortOrderParams {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'aeb87993-c0e0-42d6-b6e7-8d23d5efa5c5',
    description: 'UUID of the organization',
    required: false,
  })
  uuid?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'my org',
    description: 'Name of the organization',
    required: false,
  })
  name?: string;

  getOrgSortOrder(): OrgSortOrder | undefined {
    const sortOrder = this.getSortOrder();
    if (!sortOrder) return undefined;
    return OrgSortOrderKey.reduce((acc, key) => {
      if (sortOrder[key]) {
        acc[key] = sortOrder[key];
      }
      return acc;
    }, {} as OrgSortOrder);
  }
}