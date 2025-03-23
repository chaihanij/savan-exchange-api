import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';

export type Pagination = {
  limit: number;
  skip: number;
};

export class PaginationSortOrderParams {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
    minimum: 1,
    required: false,
  })
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The page size',
    example: 10,
    minimum: 10,
    maximum: 100,
    required: false,
  })
  pageSize?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The sort order',
    example: 'name,-createdAt',
    required: false,
  })
  orders?: string;

  getPage(): number {
    return this.page || 1;
  }

  getPageSize(): number {
    return this.pageSize || 10;
  }

  getPagination(): Pagination {
    const limit = this.getPageSize();
    const skip = this.getPage() ? (this.getPage() - 1) * limit : 0;
    return { limit, skip };
  }

  getFilter(): Record<string, any> {
    return Object.keys(this).reduce(
      (acc, key) => {
        if (key === 'page' || key === 'pageSize' || key === 'orders') {
          return acc;
        }
        if (this[key] !== undefined) {
          acc[key] = this[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  getSortOrder(): Record<string, SortOrder> | undefined {
    return this.parseSortQuery(this.orders);
  }

  private parseSortQuery(
    sortQuery?: string,
  ): Record<string, 1 | -1> | undefined {
    if (!sortQuery) return undefined;

    return sortQuery.split(',').reduce(
      (acc, field) => {
        if (field.startsWith('-')) {
          acc[field.substring(1)] = -1;
        } else {
          acc[field] = 1;
        }
        return acc;
      },
      {} as Record<string, 1 | -1>,
    );
  }
}