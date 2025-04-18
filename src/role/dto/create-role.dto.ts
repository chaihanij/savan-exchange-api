import { AccountTypeEnum } from '../../shared/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  tenantId: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Administrator role with full access' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isSystemRole: boolean;

  @ApiProperty({ example: ['policy-id01', 'policy-id02'] })
  @IsString({ each: true })
  policyIds: string[];

  @ApiProperty({
    example: [AccountTypeEnum.Admin, AccountTypeEnum.Root],
    enum: AccountTypeEnum,
    isArray: true,
  })
  @IsEnum(AccountTypeEnum, { each: true })
  @IsOptional()
  assignableTo: AccountTypeEnum[];

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}
