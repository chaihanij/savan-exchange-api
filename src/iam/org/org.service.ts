import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import {
  Org,
  OrgDocument,
  OrgProjection,
  OrgSortOrder,
} from './schemas/org.schema';
import { AppException, Pagination } from '../../helpers';
import { AppResponse } from '../../helpers/';
import { ORG_DELETED, ORG_NOT_FOUND } from './org.constant';

export type OrgServiceOptions = {
  pagination?: Pagination;
  projection?: OrgProjection;
  sort?: OrgSortOrder;
  isPopulate?: boolean;
};

@Injectable()
export class OrgService {
  logger = new Logger(OrgService.name);

  constructor(@InjectModel(Org.name) private orgModel: Model<OrgDocument>) {}

  async create(input: any) {
    const org = new this.orgModel(input);
    return org.save();
  }

  async findAll(
    filter: RootFilterQuery<any>,
    options: OrgServiceOptions | undefined = undefined,
  ): Promise<Org[]> {
    const query = this.orgModel.find(filter);
    if (options?.pagination) {
      const { limit, skip } = options.pagination;
      query.limit(limit).skip(skip);
    }
    if (options?.sort) query.sort(options.sort);
    if (options?.projection) query.select(options.projection);
    if (options?.isPopulate) {
      query.populate('createdByUuid').populate('updatedByUuid');
    }
    const orgs = await query.exec();
    return orgs as Org[];
  }

  async findOne(
    filter: RootFilterQuery<any>,
    options: OrgServiceOptions | undefined = undefined,
  ): Promise<Org> {
    const query = this.orgModel.findOne(filter);
    if (options) {
      if (options.projection) query.select(options.projection);
      if (options.isPopulate) {
        query.populate('createdByUuid').populate('updatedByUuid');
      }
    }
    const org = await query.exec();
    return org as Org;
  }

  async update(
    filter: RootFilterQuery<any>,
    update: any,
    options: OrgServiceOptions | undefined = undefined,
  ): Promise<Org> {
    const query = this.orgModel.findOneAndUpdate(filter, update, { new: true });
    if (options) {
      if (options.projection) query.select(options.projection);
      if (options.isPopulate) {
        query.populate('createdByUuid').populate('updatedByUuid');
      }
    }
    const org = await query.exec();
    return org as Org;
  }

  async remove(filter: RootFilterQuery<any>) {
    try {
      const result = await this.orgModel.findOneAndDelete(filter).exec();
      if (!result) {
        const e = new AppException(HttpStatus.NOT_FOUND, ORG_NOT_FOUND);
        return Promise.reject(e);
      }
      return new AppResponse(HttpStatus.OK, ORG_DELETED);
    } catch (e) {
      this.logger.error(e);
      const message = e.message || 'Internal Server Error';
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }
}
