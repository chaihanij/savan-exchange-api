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
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { UserQueryParam } from './user.query.param';
import {
  AppResponse,
  PaginatedResponse,
  PaginatedResponseDecorator,
} from '../../helpers';

@Controller('user')
@ApiTags('User')
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
  @ApiOkResponse(PaginatedResponseDecorator(User))
  async findAll(@Param() userQueryParam: UserQueryParam) {
    try {
      const filter = userQueryParam.getFilter();
      const options: UserServiceOptions = {
        pagination: userQueryParam.getPagination(),
        sort: userQueryParam.getUserSortOrder(),
      };
      const total = await this.userService.count(filter);
      const users = await this.userService.findAll(filter, options);
      return PaginatedResponse.success<User>(
        users,
        total,
        userQueryParam.getPage(),
        userQueryParam.getPageSize(),
      );
    } catch (e) {
      throw e;
    }
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a user by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user',
    type: User,
  })
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
