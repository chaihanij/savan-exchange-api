import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AccountService } from '../account.service';
import { Account } from '../../shared/schemas/account.schema';
import { CreateAccountDto, FilterAccountDto, UpdateAccountDto } from '../dto';
import { AppException } from '../../shared/utils';

const mockAccount = {
  _id: '123',
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  save: jest.fn(),
};

const mockModel = () => ({
  create: jest.fn(),
  countDocuments: jest.fn(),
  estimatedDocumentCount: jest.fn(),
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
});

describe('AccountService', () => {
  let service: AccountService;
  let model: ReturnType<typeof mockModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getModelToken(Account.name),
          useFactory: mockModel,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    model = module.get(getModelToken(Account.name));
  });

  it('should create an account', async () => {
    const dto: CreateAccountDto = mockAccount as any;
    jest.spyOn(model, 'create').mockResolvedValueOnce(mockAccount);
    const result = await service.create(dto);
    expect(result).toEqual(mockAccount);
  });

  it('should count accounts with filters', async () => {
    jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(5);
    const result = await service.count({ name: 'John' } as FilterAccountDto);
    expect(result).toBe(5);
  });

  it('should fallback to estimatedDocumentCount when no filters', async () => {
    jest.spyOn(model, 'estimatedDocumentCount').mockResolvedValueOnce(10);
    const result = await service.count({} as FilterAccountDto);
    expect(result).toBe(10);
  });

  it('should find accounts', async () => {
    jest.spyOn(model, 'exec').mockResolvedValueOnce([mockAccount]);
    const result = await service.find({
      name: 'John',
      limit: 10,
      skip: 0,
    } as FilterAccountDto);
    expect(result).toEqual([mockAccount]);
  });

  it('should find one account', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(mockAccount) } as any);
    const result = await service.findOne({ username: 'johndoe' } as FilterAccountDto);
    expect(result).toEqual(mockAccount);
  });

  it('should update an account', async () => {
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(mockAccount) } as any);
    const result = await service.update(
      { username: 'johndoe' } as FilterAccountDto,
      { email: 'new.email@example.com' } as UpdateAccountDto,
    );
    expect(result).toEqual(mockAccount);
  });

  it('should throw if account not found during update', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) } as any);
    await expect(
      service.update(
        { username: 'unknown' } as FilterAccountDto,
        { email: 'new.email@example.com' } as UpdateAccountDto,
      ),
    ).rejects.toThrow(AppException);
  });
});
