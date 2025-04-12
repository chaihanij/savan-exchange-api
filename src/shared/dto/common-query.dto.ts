import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SortOrder } from 'mongoose';

export class CommonQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword', example: 'keyword' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort order (e.g., name,-createdAt)',
    example: 'name,-createdAt',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.join(',') : value))
  @IsString()
  orders?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated fields to include',
    example: 'field1,field2,field3,...',
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : (value?.split(',') ?? [])))
  @IsOptional()
  select?: string[];

  @ApiPropertyOptional({
    description: 'Number of records to skip',
    example: 0,
    minimum: 0,
  })
  @Transform(({ value }) => parseInt(value, 10))
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
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  getOrders(allowedFields?: string[]): Record<string, SortOrder> | undefined {
    if (!this.orders) return undefined;
    const sortOrder: Record<string, SortOrder> = {};
    const orders = this.orders.split(',');
    for (const order of orders) {
      const direction = order.startsWith('-') ? 'desc' : 'asc';
      const field = order.replace(/^-/, '').trim();
      if (!field) continue;
      if (allowedFields && !allowedFields.includes(field)) continue;
      sortOrder[field] = direction as SortOrder;
    }
    return sortOrder;
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
}
