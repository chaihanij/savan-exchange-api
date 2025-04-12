import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PolicyService } from '../policy.service';
import { CreatePolicyDto, FilterPolicyDto, UpdatePolicyDto } from '../dto';
import { Policy } from '../../shared/schemas/policy.shcema';

const mockPolicy = {
  _id: '123',
  policyId: 'policy-001',
  tenantId: 'tenant-001',
  name: 'ManageUsers',
  description: 'Allows user management',
  isSystemRole: false,
  statements: [
    {
      effect: 'allow',
      action: ['user:create'],
      resource: ['user:*'],
    },
  ],
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

describe('PolicyService', () => {
  let service: PolicyService;
  let model: ReturnType<typeof mockModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyService,
        {
          provide: getModelToken(Policy.name),
          useFactory: mockModel,
        },
      ],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
    model = module.get(getModelToken(Policy.name));
  });

  it('should create a policy', async () => {
    const dto: CreatePolicyDto = mockPolicy as any;
    jest.spyOn(model, 'create').mockResolvedValueOnce(mockPolicy);
    const result = await service.create(dto);
    expect(result).toEqual(mockPolicy);
  });

  it('should count policies', async () => {
    jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(5);
    const result = await service.count({ name: 'ManageUsers' } as any);
    expect(result).toBe(5);
  });

  it('should fallback to estimatedDocumentCount when no filters', async () => {
    jest.spyOn(model, 'estimatedDocumentCount').mockResolvedValueOnce(10);
    const result = await service.count({} as any);
    expect(result).toBe(10);
  });

  it('should find policies', async () => {
    jest.spyOn(model, 'exec').mockResolvedValueOnce([mockPolicy]);
    const result = await service.find({} as FilterPolicyDto);
    expect(result).toEqual([mockPolicy]);
  });

  it('should find one policy', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(mockPolicy) } as any);
    const result = await service.findOne({ policyId: 'policy-001' } as FilterPolicyDto);
    expect(result).toEqual(mockPolicy);
  });

  it('should update a policy', async () => {
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(mockPolicy) } as any);
    const result = await service.update(
      { policyId: 'policy-001' } as FilterPolicyDto,
      { name: 'Updated Policy' } as UpdatePolicyDto,
    );
    expect(result).toEqual(mockPolicy);
  });

  it('should throw if policy not found during update', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) } as any);
    await expect(
      service.update({ policyId: '123' } as FilterPolicyDto, { name: 'Updated' } as UpdatePolicyDto),
    ).rejects.toThrow('Policy not found');
  });
});
