import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountResponseDto, CreateAccountDto, FilterAccountDto, UpdateAccountDto } from './dto';
import { AppException, ResponseWrapper } from '../shared/utils';
import { AccountStatus } from '../shared/interfaces';
import { JwtTokenGuard, PolicyGuard } from '../auth';
import { CheckPolicy } from '../shared/decorators/check-policy.decorator';
import { ActionEnum, ResourceEnum } from '../shared/resources';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtTokenGuard, PolicyGuard)
  @CheckPolicy(ActionEnum.Write, ResourceEnum.Account)
  @Post()
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Account created successfully', type: AccountResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() dto: CreateAccountDto) {
    try {
      return await this.accountService.create(dto);
    } catch (error) {
      this.handleError(error, 'An error occurred while creating the account');
    }
  }

  @UseGuards(JwtTokenGuard, PolicyGuard)
  @CheckPolicy(ActionEnum.Read, ResourceEnum.Account)
  @Get()
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Get a list of accounts with filters' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 200,
    description: 'Account list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/AccountResponseDto' } },
        total: { type: 'number' },
        limit: { type: 'number' },
        skip: { type: 'number' },
      },
    },
  })
  async find(@Query() dto: FilterAccountDto): Promise<ResponseWrapper<AccountResponseDto[]>> {
    try {
      const [total, data] = await Promise.all([this.accountService.count(dto), this.accountService.find(dto)]);
      return new ResponseWrapper<AccountResponseDto[]>(data, total, dto.limit, dto.skip);
    } catch (error) {
      this.handleError(error, 'An error occurred while retrieving accounts');
    }
  }

  @UseGuards(JwtTokenGuard, PolicyGuard)
  @CheckPolicy(ActionEnum.Read, ResourceEnum.Account)
  @Get(':accountId')
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully', type: AccountResponseDto })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('accountId') accountId: string) {
    try {
      const result = await this.accountService.findOne({ accountId } as FilterAccountDto);
      if (!result) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Account not found');
      }
      return result;
    } catch (error) {
      this.handleError(error, 'An error occurred while retrieving the account');
    }
  }

  @UseGuards(JwtTokenGuard, PolicyGuard)
  @CheckPolicy(ActionEnum.Write, ResourceEnum.Account)
  @Patch(':accountId')
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({ status: 200, description: 'Account updated successfully', type: AccountResponseDto })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('accountId') accountId: string, @Body() dto: UpdateAccountDto) {
    try {
      return await this.accountService.update({ accountId } as FilterAccountDto, dto);
    } catch (error) {
      this.handleError(error, 'An error occurred while updating the account');
    }
  }

  @UseGuards(JwtTokenGuard, PolicyGuard)
  @CheckPolicy(ActionEnum.Write, ResourceEnum.Account)
  @Delete(':accountId')
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Soft delete an account by ID' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully (soft delete)', type: AccountResponseDto })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('accountId') accountId: string) {
    try {
      return await this.accountService.update(
        { accountId } as FilterAccountDto,
        { status: AccountStatus.Deleted } as UpdateAccountDto,
      );
    } catch (error) {
      this.handleError(error, 'An error occurred while deleting the account');
    }
  }

  private handleError(error: any, defaultMessage: string): never {
    if (error instanceof AppException) {
      throw error;
    } else if (error?.code === 11000) {
      throw new AppException(HttpStatus.CONFLICT, 'Duplicate key error: already exists');
    } else {
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, defaultMessage);
    }
  }
}
