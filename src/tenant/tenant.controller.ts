import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto, FilterTenantDto, TenantResponseDto, UpdateTenantDto } from './dto';
import { AppException, ResponseWrapper } from '../shared/utils';
import { handleError } from '../shared/utils/handle-error';

@ApiTags('Tenant')
@Controller('tenant')
export class TenantController {
  logger = new Logger(TenantController.name);

  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({ status: 201, description: 'Tenant created successfully', type: TenantResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    try {
      return await this.tenantService.create(createTenantDto);
    } catch (error) {
      handleError(error, 'An error occurred while creating the tenant');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get list of tenants with filters' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 200,
    description: 'Tenant list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/TenantResponseDto' } },
        total: { type: 'number' },
        limit: { type: 'number' },
        skip: { type: 'number' },
      },
    },
  })
  async find(@Query() filterTenantDto: FilterTenantDto): Promise<void | ResponseWrapper<TenantResponseDto[]>> {
    try {
      const [total, data] = await Promise.all([
        this.tenantService.count(filterTenantDto),
        this.tenantService.find(filterTenantDto),
      ]);
      return new ResponseWrapper<TenantResponseDto[]>(data, total, filterTenantDto.limit, filterTenantDto.skip);
    } catch (error) {
      this.logger.error(error);
      handleError(error, 'An error occurred while retrieving tenants');
      return;
    }
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get a single tenant by ID' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully', type: TenantResponseDto })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('tenantId') tenantId: string) {
    try {
      const result = await this.tenantService.findOne({ tenantId } as FilterTenantDto);
      if (!result) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Tenant not found');
      }
      return result;
    } catch (error) {
      handleError(error, 'An error occurred while retrieving the tenant');
    }
  }

  @Patch(':tenantId')
  @ApiOperation({ summary: 'Update a tenant by ID' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully', type: TenantResponseDto })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('tenantId') tenantId: string, @Body() updateTenantDto: UpdateTenantDto) {
    try {
      return await this.tenantService.update({ tenantId } as FilterTenantDto, updateTenantDto);
    } catch (error) {
      handleError(error, 'An error occurred while updating the tenant');
    }
  }

  @Delete(':tenantId')
  @ApiOperation({ summary: 'Soft delete a tenant by ID' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant deleted successfully (soft delete)', type: TenantResponseDto })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('tenantId') tenantId: string) {
    try {
      return await this.tenantService.update({ tenantId } as FilterTenantDto, { isDeleted: true } as UpdateTenantDto);
    } catch (error) {
      handleError(error, 'An error occurred while deleting the tenant');
    }
  }
}
