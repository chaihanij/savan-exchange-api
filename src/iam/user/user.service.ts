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
  logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(input: any) {
    const user = new this.userModel(input);
    return user.save();
  }

  async findAll(
    filter: RootFilterQuery<any>,
    option: UserServiceOptions | undefined = undefined,
  ): Promise<User[]> {
    return this.userModel.find(filter).exec();
  }

  async findOne(
    filter: RootFilterQuery<any>,
    option: UserServiceOptions | undefined = undefined,
  ): Promise<User> {
    const user = await this.userModel.findOne(filter).exec();
    return user as User;
  }

  async update(
    filter: RootFilterQuery<any>,
    update: UpdateQuery<any>,
    option: UserServiceOptions | undefined = undefined,
  ): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(filter, update, { new: true })
      .exec();
    return user as User;
  }

  async remove(filter: RootFilterQuery<any>) {
    try {
      const result = await this.userModel.findOneAndDelete(filter).exec();
      if (!result) {
        const e = new AppException(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
        return Promise.reject(e);
      }
      return new AppResponse(HttpStatus.OK, USER_DELETED);
    } catch (e) {
      this.logger.error(e);
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
    }
  }
}
