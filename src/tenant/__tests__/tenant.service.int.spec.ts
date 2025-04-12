import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from '../tenant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from '../../shared/schemas';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { CreateTenantDto, FilterTenantDto, UpdateTenantDto } from '../dto';

describe('TenantService (Integration)', () => {
  let service: TenantService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }])],
      providers: [TenantService],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  it('should create and find tenant', async () => {
    const dto: CreateTenantDto = {
      name: 'Savan',
      slug: 'savan',
    } as any;

    const created = await service.create(dto);
    expect(created.name).toBe('Savan');
    console.log(created);

    const found = await service.findOne({ tenantId: created.tenantId } as any);
    expect(found).toBeDefined();
    expect(found?.name).toBe('Savan');
  });

  it('should count tenants', async () => {
    const count = await service.count({} as FilterTenantDto);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('should find tenants with filter', async () => {
    const result = await service.find({ search: 'Savan' } as FilterTenantDto);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a tenant and return updated', async () => {
    const all = await service.find({} as FilterTenantDto);
    const target = all[0];

    const updated = await service.update(
      { tenantId: target.tenantId } as FilterTenantDto,
      { name: 'Updated Savan' } as UpdateTenantDto,
    );

    expect(updated.name).toBe('Updated Savan');
  });
});
