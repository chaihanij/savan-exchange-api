import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { SortOrder } from 'mongoose';

export type Pagination = {
  limit: number;
  skip: number;
};

export class PaginationSortOrderParams {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(100)
  pageSize?: number;

  @IsString()
  @IsOptional()
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
