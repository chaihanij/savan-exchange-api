import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Role,
  RoleDocument,
  RoleProjection,
  RoleSortOrder,
} from './schemas/role.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { AppException, AppResponse, Pagination } from '../../helpers';
import { ROLE_DELETED, ROLE_NOT_FOUND } from './role.constant';

export type RoleServiceOptions = {
  pagination?: Pagination;
  projection?: RoleProjection;
  sort?: RoleSortOrder;
  isPopulate?: boolean;
};

@Injectable()
export class RoleService {
  logger = new Logger(RoleService.name);

  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(input: any): Promise<Role> {
    const role = new this.roleModel(input);
    return role.save();
  }

  async findAll(
    filter: RootFilterQuery<any>,
    options: RoleServiceOptions | undefined = undefined,
  ): Promise<Role[]> {
    const query = this.roleModel.find(filter);
    if (options) {
      if (options.projection) query.select(options.projection);
      if (options.sort) query.sort(options.sort);
      if (options.pagination) {
        query.skip(options.pagination.skip).limit(options.pagination.limit);
      }
      if (options.isPopulate) query.populate('org');
    }
    const roles = await query.exec();
    return roles as Role[];
  }

  async findOne(
    filter: RootFilterQuery<any>,
    options: RoleServiceOptions | undefined = undefined,
  ): Promise<Role> {
    const query = this.roleModel.findOne(filter);
    if (options) {
      if (options.projection) query.select(options.projection);
      if (options.isPopulate) query.populate('org');
    }
    const role = await query.exec();
    return role as Role;
  }

  async update(
    filter: RootFilterQuery<any>,
    update: any,
    options: RoleServiceOptions | undefined = undefined,
  ): Promise<Role> {
    const query = this.roleModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (options) {
      if (options.projection) query.select(options.projection);
      if (options.isPopulate) query.populate('org');
    }
    const role = await query.exec();
    return role as Role;
  }

  async remove(filter: RootFilterQuery<any>) {
    try {
      const result = await this.roleModel.findOneAndDelete(filter).exec();
      if (!result) {
        const e = new AppException(HttpStatus.NOT_FOUND, ROLE_NOT_FOUND);
        return Promise.reject(e);
      }
      return new AppResponse(HttpStatus.OK, ROLE_DELETED);
    } catch (e) {
      this.logger.error(e);
      const message = e.message || 'Internal Server Error';
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }
}
