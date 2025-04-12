import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanTypeEnum, TenantInterface, TenantStatusEnum } from '../interfaces';
import { randomUUID } from 'crypto';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant implements TenantInterface {
  @ApiProperty({
    example: '5f8d0c9e4b3b2c001c8d4e3a',
    description: 'ID ของ tenant',
  })
  @Prop({
    unique: true,
    default: () => randomUUID(),
  })
  tenantId: string;

  @ApiPropertyOptional({
    example: '5e5933f6-8715-4cbe-9ce6-d55270b13dea',
    description: 'ownerId ของ tenant',
  })
  @Prop({ type: String, default: null })
  ownerId: string;

  @ApiProperty({
    example: 'Savan Exchange',
    description: 'ชื่อของ tenant หรือองค์กร',
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiPropertyOptional({
    example: 'Savan Exchange is a digital asset exchange.',
    description: 'คำอธิบายของ tenant หรือองค์กร',
  })
  @Prop({ type: String, default: null })
  description: string;

  @ApiProperty({
    example: 'savan',
    description: 'slug สำหรับ URL หรือการอ้างอิง',
  })
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @ApiProperty({
    example: PlanTypeEnum.Free,
    enum: PlanTypeEnum,
    description: 'ประเภทแผนที่ tenant ใช้',
  })
  @Prop({ type: String, enum: PlanTypeEnum, default: PlanTypeEnum.Free })
  plan: PlanTypeEnum;

  @ApiProperty({
    example: TenantStatusEnum.Active,
    enum: TenantStatusEnum,
    description: 'สถานะการใช้งานของ tenant',
  })
  @Prop({
    type: String,
    enum: TenantStatusEnum,
    default: TenantStatusEnum.Active,
  })
  status: TenantStatusEnum;

  @ApiPropertyOptional({
    example: '2025-04-10T00:00:00.000Z',
    description: 'วันที่สิ้นสุดการทดลองใช้ฟรี',
  })
  @Prop({ type: Date, default: null })
  trialEndsAt: Date;

  @ApiPropertyOptional({
    example: 'email@savan-exchange.com',
    description: 'อีเมลสำหรับการเรียกเก็บเงิน',
  })
  @Prop({ type: String, default: null })
  billingEmail: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'URL ของโลโก้องค์กร',
  })
  @Prop({ type: String, default: null })
  logoUrl: string;

  @ApiPropertyOptional({
    description: 'การตั้งค่าที่เกี่ยวข้องกับ tenant',
    example: '{"theme": "dark", "language": "en"}',
  })
  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  settings: Record<string, any>;

  @ApiProperty({
    example: true,
    description: 'ระบุว่า tenant ถูกลบแบบ soft delete หรือไม่',
  })
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @ApiProperty({
    example: '2025-04-10T00:00:00.000Z',
    description: 'วันที่ tenant ถูกสร้าง',
  })
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-10T12:00:00.000Z',
    description: 'วันที่ tenant ถูกอัปเดตล่าสุด',
  })
  @Prop({ type: Date })
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
