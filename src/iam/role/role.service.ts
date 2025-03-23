import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument, RoleSortOrder } from './schemas/role.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { AppException, AppResponse, Pagination } from '../../helpers';
import { ROLE_DELETED, ROLE_NOT_FOUND } from './role.constant';

export type RoleServiceOptions = {
  pagination?: Pagination;
  sort?: RoleSortOrder;
  isPopulate?: boolean;
};

@Injectable()
export class RoleService {
  logger = new Logger(RoleService.name);

  constructor(@InjectModel(Role.name) private model: Model<RoleDocument>) {}

  async count(filter: RootFilterQuery<any>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async create(input: any): Promise<Role> {
    const role = new this.model(input);
    return role.save();
  }

  async findAll(
    filter: RootFilterQuery<any>,
    options: RoleServiceOptions | undefined = undefined,
  ): Promise<Role[]> {
    const query = this.model.find(filter).select({ __v: 0, _id: 0 });

    if (options?.sort) {
      query.sort(options.sort);
    }

    if (options?.pagination) {
      query.limit(options.pagination.limit).skip(options.pagination.skip);
    }

    if (options?.isPopulate) {
      query.populate('createdBy').populate('updatedBy').populate('org');
    }

    const roles = await query.exec();
    return roles as Role[];
  }

  async findOne(
    filter: RootFilterQuery<any>,
    options: RoleServiceOptions | undefined = undefined,
  ): Promise<Role> {
    const query = this.model.findOne(filter).select({ __v: 0, _id: 0 });

    if (options?.isPopulate) {
      query.populate('createdBy').populate('updatedBy').populate('org');
    }

    const role = await query.exec();
    return role as Role;
  }

  async update(
    filter: RootFilterQuery<any>,
    update: any,
    options: RoleServiceOptions | undefined = undefined,
  ): Promise<Role> {
    const query = this.model
      .findOneAndUpdate(filter, update, { new: true })
      .select({ __v: 0, _id: 0 });

    if (options?.isPopulate) {
      query.populate('createdBy').populate('updatedBy').populate('org');
    }

    const role = await query.exec();
    return role as Role;
  }

  async remove(filter: RootFilterQuery<any>) {
    const role = await this.findOne(filter);
    if (!role) {
      throw new AppException(HttpStatus.NOT_FOUND, ROLE_NOT_FOUND);
    }
    return new AppResponse(HttpStatus.OK, ROLE_DELETED);
  }
}
