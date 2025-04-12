import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../shared/schemas/account.schema';
import { AppException, BuilderMongoOperationQuery } from '../shared/utils';
import { CreateAccountDto, FilterAccountDto, UpdateAccountDto } from './dto';

const searchableFields = ['name', 'username', 'email', 'phone'];

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly model: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    return await this.model.create(createAccountDto);
  }

  async count(filter: FilterAccountDto): Promise<number> {
    const builder = new BuilderMongoOperationQuery<FilterAccountDto>(filter);
    const filters = builder.getFilters();
    return Object.keys(filters).length === 0
      ? await this.model.estimatedDocumentCount()
      : await this.model.countDocuments(filters);
  }

  async find(filter: FilterAccountDto): Promise<Account[]> {
    const builder = new BuilderMongoOperationQuery<FilterAccountDto>(filter, searchableFields);
    const filters = builder.getFilters();
    const sort = builder.getOrders();
    const select = builder.getSelect();
    const pagination = builder.getPagination();

    const query = this.model.find(filters);
    if (select) query.select(select);
    if (sort) query.sort(sort);
    if (pagination) {
      query.limit(pagination.limit);
      query.skip(pagination.skip);
    }
    return await query.exec();
  }

  async findOne(filter: FilterAccountDto): Promise<Account | null> {
    const builder = new BuilderMongoOperationQuery<FilterAccountDto>(filter);
    const filters = builder.getFilters();
    return await this.model.findOne(filters).exec();
  }

  async update(filter: FilterAccountDto, dto: UpdateAccountDto): Promise<Account> {
    const builder = new BuilderMongoOperationQuery<FilterAccountDto>(filter);
    const filters = builder.getFilters();
    const updated = await this.model.findOneAndUpdate(filters, dto, { new: true }).exec();
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Account not found');
    }
    return updated;
  }
}
