import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TenantService } from '../tenant.service';
import { Tenant } from '../../shared/schemas';
import { CreateTenantDto, FilterTenantDto, UpdateTenantDto } from '../dto';

const mockTenant = {
  _id: '123',
  name: 'Savan',
  description: 'A demo tenant',
  save: jest.fn(),
};

const mockModel = () => ({
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn().mockReturnThis(),
  countDocuments: jest.fn(),
  estimatedDocumentCount: jest.fn(),
  exec: jest.fn(),
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  create: jest.fn(),
});

describe('TenantService', () => {
  let service: TenantService;
  let model: ReturnType<typeof mockModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getModelToken(Tenant.name),
          useFactory: mockModel,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    model = module.get(getModelToken(Tenant.name));
  });
  
  it('should create a tenant', async () => {
    const dto: CreateTenantDto = { name: 'Savan', slug: 'savan' } as any;
    jest.spyOn(model, 'create').mockResolvedValueOnce(mockTenant);
    const result = await service.create(dto);
    expect(result).toEqual(mockTenant);
  });

  it('should count tenants', async () => {
    jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(5);
    const result = await service.count({ name: 'test' } as any);
    expect(result).toBe(5);
  });

  it('should fallback to estimatedDocumentCount when no filters', async () => {
    jest.spyOn(model, 'estimatedDocumentCount').mockResolvedValueOnce(10);
    const result = await service.count({} as any);
    expect(result).toBe(10);
  });

  it('should find tenants', async () => {
    jest.spyOn(model, 'exec').mockResolvedValueOnce([mockTenant]);
    const result = await service.find({} as FilterTenantDto);
    expect(result).toEqual([mockTenant]);
  });

  it('should find one tenant', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(mockTenant) } as any);
    const result = await service.findOne({ tenantId: '123' } as FilterTenantDto);
    expect(result).toEqual(mockTenant);
  });

  it('should update a tenant', async () => {
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(mockTenant) } as any);
    const result = await service.update({ tenantId: '123' } as FilterTenantDto, { name: 'Updated' } as UpdateTenantDto);
    expect(result).toEqual(mockTenant);
  });

  it('should throw if tenant not found during update', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) } as any);
    await expect(
      service.update({ tenantId: '123' } as FilterTenantDto, { name: 'Updated' } as UpdateTenantDto),
    ).rejects.toThrow('Tenant not found');
  });
});
