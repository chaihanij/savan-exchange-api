import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService, RoleServiceOptions } from './role.service';
import { CreateRoleDto } from './dtos /create-role.dto';
import { UpdateRoleDto } from './dtos /update-role.dto';
import { Role } from './schemas/role.schema';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppResponse,
  PaginatedResponse,
  PaginatedResponseDecorator,
} from '../../helpers';
import { RoleQueryParam } from './role.query.param';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  private readonly logger = new Logger(RoleController.name);

  constructor(private roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created org',
    type: Role,
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return await this.roleService.create(createRoleDto);
    } catch (error) {
      this.logger.error('Error creating role', error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse(PaginatedResponseDecorator(Role))
  async findAll(
    @Param() roleQueryParam: RoleQueryParam,
  ): Promise<PaginatedResponse<Role>> {
    try {
      const filter = roleQueryParam.getFilter();
      const options: RoleServiceOptions = {
        pagination: roleQueryParam.getPagination(),
        sort: roleQueryParam.getRoleSortOrder(),
      };
      const total = await this.roleService.count(filter);
      const roles = await this.roleService.findAll(filter, options);
      return PaginatedResponse.success<Role>(
        roles,
        total,
        roleQueryParam.getPage(),
        roleQueryParam.getPageSize(),
      );
    } catch (error) {
      this.logger.error('Error fetching role', error.stack);
      throw error;
    }
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get role by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved role',
    type: Role,
  })
  async findOne(@Param('uuid') uuid: string): Promise<Role> {
    try {
      return this.roleService.findOne({ uuid }, { isPopulate: true });
    } catch (error) {
      this.logger.error(`Error fetching role with uuid: ${uuid}`, error.stack);
      throw error;
    }
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update role by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully update role',
    type: Role,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    try {
      return await this.roleService.update({ uuid }, updateRoleDto, {
        isPopulate: true,
      });
    } catch (error) {
      this.logger.error(`Error updating role with uuid: ${uuid}`, error.stack);
      throw error;
    }
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Remove role by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed role',
    type: AppResponse,
  })
  async remove(@Param('uuid') uuid: string): Promise<AppResponse> {
    try {
      return await this.roleService.remove({ uuid });
    } catch (error) {
      this.logger.error(`Error deleting role with uuid: ${uuid}`, error.stack);
      throw error;
    }
  }
}
