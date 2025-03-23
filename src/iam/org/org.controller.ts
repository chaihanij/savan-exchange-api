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
  Query,
} from '@nestjs/common';
import { OrgService, OrgServiceOptions } from './org.service';
import { CreateOrgDto } from './dtos/create-org.dto';
import { UpdateOrgDto } from './dtos/update-org.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Org } from './schemas/org.schema';
import {
  AppResponse,
  PaginatedResponse,
  PaginatedResponseDecorator,
} from '../../helpers/';
import { OrgQueryParam } from './org.query.param';

@Controller('org')
@ApiTags('Org')
export class OrgController {
  private readonly logger = new Logger(OrgController.name);

  constructor(private readonly orgService: OrgService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new org' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created org',
    type: Org,
  })
  async create(@Body() createOrgDto: CreateOrgDto): Promise<Org> {
    try {
      return await this.orgService.create(createOrgDto);
    } catch (error) {
      this.logger.error('Error creating org', error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orgs' })
  @ApiOkResponse(PaginatedResponseDecorator(Org))
  async findAll(
    @Query() orgQueryParam: OrgQueryParam,
  ): Promise<PaginatedResponse<Org>> {
    try {
      const filter = orgQueryParam.getFilter();
      const options: OrgServiceOptions = {
        pagination: orgQueryParam.getPagination(),
        sort: orgQueryParam.getOrgSortOrder(),
      };
      const total = await this.orgService.count(filter);
      const orgs = await this.orgService.findAll(filter, options);
      return PaginatedResponse.success<Org>(
        orgs,
        total,
        orgQueryParam.getPage(),
        orgQueryParam.getPageSize(),
      );
    } catch (error) {
      this.logger.error('Error fetching all orgs', error.stack);
      throw error;
    }
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get org by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved org',
    type: Org,
  })
  async findOne(@Param('uuid') uuid: string): Promise<Org> {
    try {
      return await this.orgService.findOne({ uuid }, { isPopulate: true });
    } catch (error) {
      this.logger.error(`Error fetching org with uuid: ${uuid}`, error.stack);
      throw error;
    }
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update org by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated org',
    type: Org,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateOrgDto: UpdateOrgDto,
  ): Promise<Org> {
    try {
      return await this.orgService.update({ uuid }, updateOrgDto, {
        isPopulate: true,
      });
    } catch (error) {
      this.logger.error(`Error updating org with uuid: ${uuid}`, error.stack);
      throw error;
    }
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete org by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted org',
    type: AppResponse,
  })
  async remove(@Param('uuid') uuid: string): Promise<AppResponse> {
    try {
      return await this.orgService.remove({ uuid });
    } catch (error) {
      this.logger.error(`Error deleting org with uuid: ${uuid}`, error.stack);
      throw error;
    }
  }
}