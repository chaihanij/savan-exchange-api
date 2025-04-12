import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PolicyService } from './policy.service';
import { CreatePolicyDto, FilterPolicyDto, PolicyResponseDto, UpdatePolicyDto } from './dto';
import { AppException, ResponseWrapper } from '../shared/utils';

@ApiTags('Policy')
@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new policy' })
  @ApiBody({ type: CreatePolicyDto })
  @ApiResponse({
    status: 201,
    description: 'Policy created successfully',
    type: PolicyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createPolicyDto: CreatePolicyDto) {
    try {
      return await this.policyService.create(createPolicyDto);
    } catch (error) {
      this.handleError(error, 'An error occurred while creating the policy');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get list of policies' })
  @ApiResponse({
    status: 200,
    description: 'Policy list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PolicyResponseDto' },
        },
        total: { type: 'number' },
        limit: { type: 'number' },
        skip: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async find(@Query() filterDto: FilterPolicyDto): Promise<ResponseWrapper<PolicyResponseDto[]>> {
    try {
      const [total, data] = await Promise.all([
        this.policyService.count(filterDto),
        this.policyService.find(filterDto),
      ]);
      return new ResponseWrapper<PolicyResponseDto[]>(data, total, filterDto.limit, filterDto.skip);
    } catch (error) {
      this.handleError(error, 'An error occurred while retrieving policies');
    }
  }

  @Get(':policyId')
  @ApiOperation({ summary: 'Get a policy by ID' })
  @ApiParam({ name: 'policyId', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy found', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('policyId') policyId: string) {
    try {
      const result = await this.policyService.findOne({ policyId } as FilterPolicyDto);
      if (!result) {
        throw new AppException(HttpStatus.NOT_FOUND, 'Policy not found');
      }
      return result;
    } catch (error) {
      this.handleError(error, 'An error occurred while retrieving the policy');
    }
  }

  @Patch(':policyId')
  @ApiOperation({ summary: 'Update a policy by ID' })
  @ApiParam({ name: 'policyId', description: 'Policy ID' })
  @ApiBody({ type: UpdatePolicyDto })
  @ApiResponse({ status: 200, description: 'Policy updated', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('policyId') policyId: string, @Body() updateDto: UpdatePolicyDto) {
    try {
      return await this.policyService.update({ policyId } as FilterPolicyDto, updateDto);
    } catch (error) {
      this.handleError(error, 'An error occurred while updating the policy');
    }
  }

  @Delete(':policyId')
  @ApiOperation({ summary: 'Delete a policy by ID (soft delete)' })
  @ApiParam({ name: 'policyId', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy soft deleted', type: PolicyResponseDto })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('policyId') policyId: string) {
    try {
      return await this.policyService.update({ policyId } as FilterPolicyDto, { isDeleted: true } as UpdatePolicyDto);
    } catch (error) {
      this.handleError(error, 'An error occurred while deleting the policy');
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
