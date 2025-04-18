import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../shared/schemas/role.schama';
import { AppException, BuilderMongoOperationQuery } from '../shared/utils';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from './dto';

const searchFields = ['name', 'description'];

@Injectable()
export class RoleService {
  logger = new Logger(RoleService.name);

  constructor(
    @InjectModel(Role.name)
    private readonly model: Model<RoleDocument>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    try {
      this.logger.log(createRoleDto, 'createRoleDto');
      return this.model.create(createRoleDto);
    } catch (e) {
      this.logger.error(e);
      if (e.code === 11000) {
        throw new AppException(HttpStatus.BAD_REQUEST, `Role already exists ${e.message}`);
      } else {
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while creating the role');
      }
    }
  }

  async count(filterRoleDto: FilterRoleDto): Promise<number> {
    const builder = new BuilderMongoOperationQuery<FilterRoleDto>(filterRoleDto, searchFields);
    const filters = builder.getFilters();
    return Object.keys(filters).length > 0
      ? await this.model.countDocuments(filters)
      : await this.model.estimatedDocumentCount();
  }

  async find(filterRoleDto: FilterRoleDto): Promise<Role[]> {
    try {
      const builder = new BuilderMongoOperationQuery<FilterRoleDto>(filterRoleDto, searchFields);

      const filters = builder.getFilters();
      const orders = builder.getOrders();
      const select = builder.getSelect();
      const pagination = builder.getPagination();

      const query = this.model.find(filters);
      if (select) query.select(select);
      if (orders) query.sort(orders);
      if (pagination) query.limit(pagination.limit).skip(pagination.skip);

      return await query.exec();
    } catch (e) {
      this.logger.error(e);
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while fetching the roles');
    }
  }

  async findOne(filterRoleDto: FilterRoleDto) {
    const builder = new BuilderMongoOperationQuery<FilterRoleDto>(filterRoleDto, searchFields);
    const filters = builder.getFilters();
    const select = builder.getSelect();
    const query = this.model.findOne(filters);
    if (select) query.select(select);
    return await query.exec();
  }

  update(filterRoleDto: FilterRoleDto, updateRoleDto: UpdateRoleDto) {
    const builder = new BuilderMongoOperationQuery<FilterRoleDto>(filterRoleDto, searchFields);
    const result = this.model.findOneAndUpdate(builder.getFilters(), updateRoleDto, { new: true }).exec();

    if (!result) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Role not found');
    }

    return result;
  }
}
