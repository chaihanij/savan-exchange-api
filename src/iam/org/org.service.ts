import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Org, OrgDocument, OrgSortOrder } from './schemas/org.schema';
import { AppException, Pagination } from '../../helpers';
import { AppResponse } from '../../helpers/';
import { ORG_DELETED, ORG_NOT_FOUND } from './org.constant';

export type OrgServiceOptions = {
  pagination?: Pagination;
  sort?: OrgSortOrder;
  isPopulate?: boolean;
};

@Injectable()
export class OrgService {
  private readonly logger = new Logger(OrgService.name);

  constructor(@InjectModel(Org.name) private model: Model<OrgDocument>) {}

  async create(input: any) {
    const org = new this.model(input);
    return org.save();
  }

  async count(filter: RootFilterQuery<any>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async findAll(
    filter: RootFilterQuery<any>,
    options: OrgServiceOptions | undefined = undefined,
  ): Promise<Org[]> {
    const query = this.model.find(filter).select({ __v: 0, _id: 0 });

    if (options?.sort) {
      query.sort(options.sort);
    }

    if (options?.pagination) {
      const { limit, skip } = options.pagination;
      query.skip(skip).limit(limit);
    }

    if (options?.isPopulate) {
      query.populate('createdBy').populate('updatedBy');
    }

    const orgs = await query.exec();
    return orgs as Org[];
  }

  async findOne(
    filter: RootFilterQuery<any>,
    options: OrgServiceOptions | undefined = undefined,
  ): Promise<Org> {
    const query = this.model.findOne(filter).select({ __v: 0, _id: 0 });

    if (options?.isPopulate) {
      query.populate('createdBy').populate('updatedBy');
    }

    const org = await query.exec();
    return org as Org;
  }

  async update(
    filter: RootFilterQuery<any>,
    update: any,
    options: OrgServiceOptions | undefined = undefined,
  ): Promise<Org> {
    const query = this.model
      .findOneAndUpdate(filter, update, { new: true })
      .select({ __v: 0, _id: 0 });

    if (options?.isPopulate) {
      query.populate('createdByUuid').populate('updatedByUuid');
    }

    const org = await query.exec();
    return org as Org;
  }

  async remove(filter: RootFilterQuery<any>) {
    const result = await this.model.findOneAndDelete(filter).exec();
    if (!result) {
      throw new AppException(HttpStatus.NOT_FOUND, ORG_NOT_FOUND);
    }
    return new AppResponse(HttpStatus.OK, ORG_DELETED);
  }
}
