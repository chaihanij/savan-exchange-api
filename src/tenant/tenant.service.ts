import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../shared/schemas';
import { AppException, BuilderMongoOperationQuery } from '../shared/utils';
import { CreateTenantDto, FilterTenantDto, UpdateTenantDto } from './dto';

export const searchableFields = ['name', 'description'];

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name)
    private readonly model: Model<TenantDocument>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return await this.model.create(createTenantDto);
  }

  async count(filterTenantDto: FilterTenantDto): Promise<number> {
    const builder = new BuilderMongoOperationQuery<FilterTenantDto>(filterTenantDto);
    const filters = builder.getFilters();
    return Object.keys(filters).length > 0
      ? await this.model.countDocuments(filters)
      : await this.model.estimatedDocumentCount();
  }

  async find(filterTenantDto: FilterTenantDto): Promise<Tenant[]> {
    const builder = new BuilderMongoOperationQuery<FilterTenantDto>(filterTenantDto, searchableFields);
    const filters = builder.getFilters();
    const orders = builder.getOrders();
    const select = builder.getSelect();
    const pagination = builder.getPagination();

    const query = this.model.find(filters);
    if (select) query.select(select);
    if (orders) query.sort(orders);
    if (pagination) query.limit(pagination.limit).skip(pagination.skip);

    return await query.exec();
  }

  async findOne(filterTenantDto: FilterTenantDto): Promise<Tenant | null> {
    const builder = new BuilderMongoOperationQuery<FilterTenantDto>(filterTenantDto);
    return await this.model.findOne(builder.getFilters()).exec();
  }

  async update(filterTenantDto: FilterTenantDto, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const builder = new BuilderMongoOperationQuery<FilterTenantDto>(filterTenantDto);
    const result = await this.model.findOneAndUpdate(builder.getFilters(), updateTenantDto, { new: true }).exec();

    if (!result) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Tenant not found');
    }

    return result;
  }
}
