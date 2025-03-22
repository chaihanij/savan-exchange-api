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
import { OrgService, OrgServiceOptions } from './org.service';
import { CreateOrgDto } from './dtos/create-org.dto';
import { UpdateOrgDto } from './dtos/update-org.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Org } from './schemas/org.schema';
import { AppResponse } from '../../helpers/';
import { OrgQueryParam } from './org.query.param';

@Controller('org')
@ApiTags('Org')
export class OrgController {
  logger = new Logger(OrgController.name);

  constructor(private orgService: OrgService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new org' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created org',
    type: Org,
  })
  create(@Body() createOrgDto: CreateOrgDto) {
    return this.orgService.create(createOrgDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orgs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved orgs',
    type: Org,
    isArray: true,
  })
  findAll(@Param() orgQueryParam: OrgQueryParam) {
    try {
      const filter = orgQueryParam.getFilter();
      const options: OrgServiceOptions = {
        pagination: orgQueryParam.getPagination(),
        sort: orgQueryParam.getOrgSortOrder(),
      };
      return this.orgService.findAll(filter, options);
    } catch (e) {
      throw e;
    }
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get org by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved org',
    type: Org,
  })
  findOne(@Param('uuid') uuid: string) {
    try {
      return this.orgService.findOne({ uuid }, { isPopulate: true });
    } catch (e) {
      throw e;
    }
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update org by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully update org',
    type: Org,
  })
  update(@Param('uuid') uuid: string, @Body() updateOrgDto: UpdateOrgDto) {
    try {
      return this.orgService.update({ uuid }, updateOrgDto, {
        isPopulate: true,
      });
    } catch (e) {
      throw e;
    }
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete org by uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully delete org',
    type: AppResponse,
  })
  remove(@Param('uuid') uuid: string) {
    try {
      return this.orgService.remove({ uuid });
    } catch (e) {
      throw e;
    }
  }
}
