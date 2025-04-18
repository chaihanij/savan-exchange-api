import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SortOrder } from 'mongoose';

const splitToArray = (value: any, separator = ','): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string')
    return value
      .split(separator)
      .map(v => v.trim())
      .filter(Boolean);
  return [];
};

const toInt = (value: any): number | undefined => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
};

export class CommonQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Advanced filter (e.g. status=in:active,pending;age>=18)',
  })
  @Transform(({ value }) => splitToArray(value, ';'))
  @IsOptional()
  filters?: string[];

  @ApiPropertyOptional({
    description: 'Sort order (e.g., name,-createdAt)',
  })
  @Transform(({ value }) => (Array.isArray(value) ? value.join(',') : value))
  @IsOptional()
  @IsString()
  orders?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated fields to include (example: field1,field2,field3)',
  })
  @Transform(({ value }) => splitToArray(value))
  @IsOptional()
  select?: string[];

  @ApiPropertyOptional({
    description: 'Number of records to skip',
    example: 0,
    minimum: 0,
  })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Number of records to return',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @Transform(({ value }) => toInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  getOrders(allowedFields?: string[]): Record<string, SortOrder> | undefined {
    if (!this.orders) return undefined;

    return this.orders.split(',').reduce(
      (acc, order) => {
        const direction: SortOrder = order.startsWith('-') ? 'desc' : 'asc';
        const field = order.replace(/^-/, '').trim();
        if (field && (!allowedFields || allowedFields.includes(field))) {
          acc[field] = direction;
        }
        return acc;
      },
      {} as Record<string, SortOrder>,
    );
  }

  getSelectedFields(): Record<string, 1> | undefined {
    if (!Array.isArray(this.select) || this.select.length === 0) return undefined;
    return this.select.reduce(
      (acc, field) => {
        const f = field.trim();
        if (f) acc[f] = 1;
        return acc;
      },
      {} as Record<string, 1>,
    );
  }

  getPagination(defaultLimit = 10): { skip: number; limit: number } {
    return {
      skip: typeof this.skip === 'number' ? this.skip : 0,
      limit: typeof this.limit === 'number' ? this.limit : defaultLimit,
    };
  }

  getFilters(): string[] | undefined {
    if (!this.filters || this.filters.length === 0) return undefined;
    if (Array.isArray(this.filters)) return this.filters;
  }
}
