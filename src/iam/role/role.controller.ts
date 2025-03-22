import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService, RoleServiceOptions } from './role.service';
import { CreateRoleDto } from './dtos /create-role.dto';
import { UpdateRoleDto } from './dtos /update-role.dto';
import { Role } from './schemas/role.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppResponse } from '../../helpers';
import { RoleQueryParam } from './role.query.param';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created org',
    type: Role,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved roles',
    type: Role,
    isArray: true,
  })
  findAll(@Param() roleQueryParam: RoleQueryParam) {
    try {
      const filter = roleQueryParam.getFilter();
      const options: RoleServiceOptions = {
        pagination: roleQueryParam.getPagination(),
        sort: roleQueryParam.getRoleSortOrder(),
      };
      return this.roleService.findAll(filter, options);
    } catch (e) {
      throw e;
    }
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get role by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved role',
    type: Role,
  })
  findOne(@Param('uuid') uuid: string) {
    try {
      return this.roleService.findOne({ uuid }, { isPopulate: true });
    } catch (e) {
      throw e;
    }
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update role by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully update role',
    type: Role,
  })
  update(@Param('uuid') uuid: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return this.roleService.update({ uuid }, updateRoleDto, {
        isPopulate: true,
      });
    } catch (e) {
      throw e;
    }
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Remove role by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed role',
    type: AppResponse,
  })
  remove(@Param('uuid') uuid: string) {
    return this.roleService.remove({ uuid });
  }
}
