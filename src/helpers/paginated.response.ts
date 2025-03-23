import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'The total number of data',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'The page size',
    example: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'The data of page',
    required: false,
    isArray: true,
  })
  data?: T[];

  constructor(total: number, page: number, pageSize: number, data: T[]) {
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.data = data;
  }

  static success<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
  ): PaginatedResponse<T> {
    return new PaginatedResponse<T>(total, page, pageSize, data);
  }
}

export function PaginatedResponseDecorator<T extends Type<any>>(data: T) {
  return {
    type: PaginatedResponse,
    schema: {
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        pageSize: { type: 'number' },
        data: { $ref: `#/components/schemas/${data.name}` },
      },
    },
  };
}
