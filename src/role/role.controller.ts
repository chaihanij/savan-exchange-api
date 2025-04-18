import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateRoleDto, FilterRoleDto, RoleResponseDto, UpdateRoleDto } from './dto';
import { handleError } from '../shared/utils/handle-error';
import { ResponseWrapper } from '../shared/utils';

@Controller('role')
export class RoleController {
  logger = new Logger(RoleController.name);

  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: RoleResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      this.logger.log(createRoleDto, 'create');
      return await this.roleService.create(createRoleDto);
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get list of roles with filters' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 200,
    description: 'Role list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/RoleResponseDto' } },
        total: { type: 'number' },
        limit: { type: 'number' },
        skip: { type: 'number' },
      },
    },
  })
  async find(@Query() FilterRoleDto: FilterRoleDto): Promise<void | ResponseWrapper<RoleResponseDto[]>> {
    try {
      const [total, data] = await Promise.all([
        this.roleService.count(FilterRoleDto),
        this.roleService.find(FilterRoleDto),
      ]);
      return new ResponseWrapper<RoleResponseDto[]>(data, total, FilterRoleDto.limit, FilterRoleDto.skip);
    } catch (error) {
      this.logger.error(error);
      handleError(error, 'An error occurred while retrieving tenants');
      return;
    }
  }

  @Get(':roleId')
  @ApiOperation({ summary: 'Get a single role by ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('roleId') roleId: string) {
    try {
      return await this.roleService.findOne({ roleId } as FilterRoleDto);
    } catch (error) {
      handleError(error, 'An error occurred while retrieving the role');
    }
  }

  @Patch(':roleId')
  @ApiOperation({ summary: 'Update a role by role id' })
  @ApiParam({ name: 'roleId', description: 'role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('roleId') roleId: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return this.roleService.update({ roleId } as FilterRoleDto, updateRoleDto);
    } catch (error) {
      handleError(error, 'An error occurred while updating the tenant');
    }
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Soft delete a role by ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully (soft delete)', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('roleId') roleId: string) {
    try {
      return await this.roleService.update({ roleId } as FilterRoleDto, { isDeleted: true } as UpdateRoleDto);
    } catch (error) {
      handleError(error, 'An error occurred while deleting the role');
    }
  }
}
