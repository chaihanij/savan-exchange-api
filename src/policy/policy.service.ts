import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument } from '../shared/schemas/policy.shcema';
import { FilterPolicyDto } from './dto/filter-policy.dto';
import { AppException, BuilderMongoOperationQuery } from '../shared/utils';

const searchableFields = ['name', 'description'];

@Injectable()
export class PolicyService {
  constructor(@InjectModel(Policy.name) private readonly model: Model<PolicyDocument>) {}

  async create(dto: CreatePolicyDto): Promise<Policy> {
    return await this.model.create(dto);
  }

  async count(dto: FilterPolicyDto): Promise<number> {
    const builder = new BuilderMongoOperationQuery<FilterPolicyDto>(dto);
    const filters = builder.getFilters();
    return Object.keys(filters).length === 0
      ? await this.model.estimatedDocumentCount()
      : await this.model.countDocuments(filters);
  }

  async find(dto: FilterPolicyDto): Promise<Policy[]> {
    const builder = new BuilderMongoOperationQuery<FilterPolicyDto>(dto, searchableFields);
    const filters = builder.getFilters();
    const select = builder.getSelect();
    const orders = builder.getOrders();
    const pagination = builder.getPagination();

    const query = this.model.find(filters);
    if (select) query.select(select);
    if (orders) query.sort(orders);
    if (pagination) query.skip(pagination.skip).limit(pagination.limit);

    return await query.exec();
  }

  async findOne(dto: FilterPolicyDto): Promise<Policy | null> {
    const builder = new BuilderMongoOperationQuery<FilterPolicyDto>(dto);
    return await this.model.findOne(builder.getFilters()).exec();
  }

  async update(filterDto: FilterPolicyDto, updateDto: UpdatePolicyDto): Promise<Policy> {
    const builder = new BuilderMongoOperationQuery<FilterPolicyDto>(filterDto);
    const updated = await this.model.findOneAndUpdate(builder.getFilters(), updateDto, { new: true }).exec();
    if (!updated) throw new AppException(HttpStatus.NOT_FOUND, 'Policy not found');
    return updated;
  }
}
