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
import { UserService, UserServiceOptions } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '../hashing/hashing.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { UserQueryParam } from './user.query.param';
import { AppResponse } from '../../helpers';

@Controller('user')
@ApiTags('Role')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private hashingService: HashingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created user',
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      if (createUserDto.password) {
        createUserDto.password = await this.hashingService.hash(
          createUserDto.password,
        );
      }
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved users',
    type: User,
    isArray: true,
  })
  async findAll(@Param() userQueryParam: UserQueryParam) {
    try {
      const filter = userQueryParam.getFilter();
      const options: UserServiceOptions = {
        pagination: userQueryParam.getPagination(),
        sort: userQueryParam.getUserSortOrder(),
      };
      return await this.userService.findAll(filter, options);
    } catch (e) {
      throw e;
    }
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    try {
      return await this.userService.findOne({ uuid }, { isPopulate: true });
    } catch (e) {
      throw e;
    }
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update user by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully update user',
    type: User,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashingService.hash(
          updateUserDto.password,
        );
      }
      return await this.userService.update({ uuid }, updateUserDto, {
        isPopulate: true,
      });
    } catch (e) {
      throw e;
    }
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Remove user by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully removed user',
    type: AppResponse,
  })
  async remove(@Param('uuid') uuid: string) {
    try {
      return await this.userService.remove({ uuid });
    } catch (e) {
      throw e;
    }
  }
}
