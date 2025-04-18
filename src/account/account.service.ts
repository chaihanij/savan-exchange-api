import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../shared/schemas/account.schema';
import { AppException, BuilderMongoOperationQuery } from '../shared/utils';
import { AccountWithRolesAndPoliciesDto, CreateAccountDto, FilterAccountDto, UpdateAccountDto } from './dto';
const searchableFields = ['name', 'username', 'email', 'phone'];

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly model: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    try {
      return await this.model.create(createAccountDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new AppException(HttpStatus.CONFLICT, 'Account already exists');
      }
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while creating the account');
    }
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
    return await query.exec();
  }

  async findOne(filter: FilterAccountDto): Promise<Account | null> {
    const builder = new BuilderMongoOperationQuery<FilterAccountDto>(filter);
    const filters = builder.getFilters();
    const query = this.model.findOne(filters);
    return await query.exec();
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

  async getAccountWithDetails(accountId: string): Promise<AccountWithRolesAndPoliciesDto | undefined> {
    const result = await this.model.aggregate([
      {
        $match: {
          accountId: accountId,
          isDeleted: false,
        },
      },
      // Lookup roles
      {
        $lookup: {
          from: 'roles',
          localField: 'roleIds',
          foreignField: 'roleId',
          as: 'roles',
        },
      },
      // Lookup account-level policies
      {
        $lookup: {
          from: 'policies',
          localField: 'policyIds',
          foreignField: 'policyId',
          as: 'policies',
        },
      },
      // Unwind roles to lookup role policies
      { $unwind: { path: '$roles', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'policies',
          localField: 'roles.policyIds',
          foreignField: 'policyId',
          as: 'roles.policies',
        },
      },
      // Regroup roles
      {
        $group: {
          _id: '$_id',
          account: { $first: '$$ROOT' },
          roles: { $push: '$roles' },
        },
      },
      // Merge roles back to root
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$account', { roles: '$roles' }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          tenantId: 1,
          accountId: 1,
          username: 1,
          email: 1,
          name: 1,
          phone: 1,
          roles: {
            roleId: 1,
            tenantId: 1,
            name: 1,
            description: 1,
            isSystemRole: 1,
            policies: {
              policyId: 1,
              tenantId: 1,
              name: 1,
              description: 1,
              isSystemRole: 1,
              statements: 1,
            },
          },
          policies: {
            policyId: 1,
            tenantId: 1,
            name: 1,
            description: 1,
            isSystemRole: 1,
            statements: 1,
          },
        },
      },
    ]);

    return result.length > 0 ? result[0] : undefined;
  }
}
