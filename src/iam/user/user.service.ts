import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, UpdateQuery } from 'mongoose';
import { User, UserDocument, UserSortOrder } from './schemas/user.schema';
import { AppException, AppResponse, Pagination } from '../../helpers';
import { USER_DELETED, USER_NOT_FOUND } from './user.constant';

export type UserServiceOptions = {
  pagination?: Pagination;
  sort?: UserSortOrder;
  isPopulate?: boolean;
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async create(input: any) {
    const user = new this.model(input);
    return user.save();
  }

  async count(filter: RootFilterQuery<any>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async findAll(
    filter: RootFilterQuery<any>,
    options: UserServiceOptions | undefined = undefined,
  ): Promise<User[]> {
    const query = this.model.find(filter).select({ __v: 0, _id: 0 });

    if (options?.sort) {
      query.sort(options.sort);
    }

    if (options?.pagination) {
      query.limit(options.pagination.limit).skip(options.pagination.skip);
    }

    if (options?.isPopulate) {
      query
        .populate('createdBy')
        .populate('updatedBy')
        .populate('org')
        .populate('roles');
    }
    return this.model.find(filter).exec();
  }

  async findOne(
    filter: RootFilterQuery<any>,
    options: UserServiceOptions | undefined = undefined,
  ): Promise<User> {
    const query = this.model.findOne(filter).select({ __v: 0, _id: 0 });

    if (options?.isPopulate) {
      query
        .populate('createdBy')
        .populate('updatedBy')
        .populate('org')
        .populate('roles');
    }

    const user = await this.model.findOne(filter).exec();
    return user as User;
  }

  async update(
    filter: RootFilterQuery<any>,
    update: UpdateQuery<any>,
    options: UserServiceOptions | undefined = undefined,
  ): Promise<User> {
    const query = this.model.findOneAndUpdate(filter, update, { new: true });

    if (options?.isPopulate) {
      query
        .populate('createdBy')
        .populate('updatedBy')
        .populate('org')
        .populate('roles');
    }

    const user = await query.exec();
    return user as User;
  }

  async remove(filter: RootFilterQuery<any>) {
    const result = await this.model.findOneAndDelete(filter).exec();
    if (!result) {
      throw new AppException(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
    }
    return new AppResponse(HttpStatus.OK, USER_DELETED);
  }
}
