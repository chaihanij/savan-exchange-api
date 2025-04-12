import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus, Type } from '@nestjs/common';

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
  console.log('PaginatedResponseDecorator', data.name);
  return {
    type: PaginatedResponse<T>,
    status: HttpStatus.OK,
    description: `Successfully retrieved for ${data.name}`,
    isArray: false,
    schema: {
      properties: {
        total: {
          type: 'number',
          description: 'The total number of data',
          example: 10,
        },
        page: {
          type: 'number',
          description: 'The page number',
          example: 1,
        },
        pageSize: {
          type: 'number',
          description: 'The page size',
          example: 10,
        },
        data: {
          type: 'array',
          description: 'The data of page',
          $ref: `#/components/schemas/${data.name}`,
        },
      },
    },
  };
}
