import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { getModelToken } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../../shared/schemas/account.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { CreateAccountDto, FilterAccountDto, UpdateAccountDto } from '../dto';

describe('AccountService (in)', () => {
  let service: AccountService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let accountModel: Model<Account>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    mongoConnection = (await connect(mongod.getUri())).connection;
    accountModel = mongoConnection.model(Account.name, AccountSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, { provide: getModelToken(Account.name), useValue: accountModel }],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await accountModel.deleteMany({});
  });

  it('should create an account', async () => {
    const createDto: CreateAccountDto = {
      name: 'John Doe',
      username: 'johndoe',
      passwordHash: 'hashedpassword',
      email: 'john.doe@example.com',
      phone: '1234567890',
    };
    const result = await service.create(createDto);

    expect(result).toBeDefined();
    expect(result.name).toBe(createDto.name);
    expect(result.username).toBe(createDto.username);
  });

  it('should count accounts', async () => {
    await accountModel.create({ name: 'John Doe', username: 'johndoe', passwordHash: 'hashedpassword' });
    await accountModel.create({ name: 'Jane Doe', username: 'janedoe', passwordHash: 'hashedpassword' });

    const count = await service.count({} as FilterAccountDto);
    expect(count).toBe(2);
  });

  it('should find accounts', async () => {
    await accountModel.create({ name: 'John Doe', username: 'johndoe', passwordHash: 'hashedpassword' });
    await accountModel.create({ name: 'Jane Doe', username: 'janedoe', passwordHash: 'hashedpassword' });

    const result = await service.find({} as FilterAccountDto);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('John Doe');
  });

  it('should find one account', async () => {
    const created = await accountModel.create({
      name: 'John Doe',
      username: 'johndoe',
      passwordHash: 'hashedpassword',
    });

    const result = await service.findOne({ username: 'johndoe' } as FilterAccountDto);
    expect(result).toBeDefined();
    expect(result?.name).toBe(created.name);
  });

  it('should update an account', async () => {
    const created = await accountModel.create({
      name: 'John Doe',
      username: 'johndoe',
      passwordHash: 'hashedpassword',
    });

    const updateDto: UpdateAccountDto = { email: 'new.email@example.com' };
    const result = await service.update({ username: 'johndoe' } as FilterAccountDto, updateDto);

    expect(result).toBeDefined();
    expect(result.email).toBe(updateDto.email);
  });

  it('should throw if account not found during update', async () => {
    await expect(
      service.update(
        { username: 'unknown' } as FilterAccountDto,
        { email: 'new.email@example.com' } as UpdateAccountDto,
      ),
    ).rejects.toThrow('Account not found');
  });
});
