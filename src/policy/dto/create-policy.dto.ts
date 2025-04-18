import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PolicyStatementEffectEnum, PolicyStatementInterface } from '../../shared/interfaces';

export class PolicyStatementDto implements PolicyStatementInterface {
  @ApiProperty({ enum: PolicyStatementEffectEnum, example: PolicyStatementEffectEnum.Allow })
  @IsEnum(PolicyStatementEffectEnum)
  effect: PolicyStatementEffectEnum;

  @ApiProperty({ example: ['user:create', 'user:update'] })
  @IsArray()
  @IsString({ each: true })
  action: string[];

  @ApiProperty({ example: ['user:*'] })
  @IsArray()
  @IsString({ each: true })
  resource: string[];

  @ApiPropertyOptional({
    example: {
      stringEquals: { 'user:tenantId': 'tenant-001' },
      stringLike: { 'user:name': 'John*' },
    },
  })
  @IsOptional()
  condition?: {
    stringEquals?: Record<string, string>;
    stringLike?: Record<string, string>;
    stringEqualsIfExists?: Record<string, string>;
    stringLikeIfExists?: Record<string, string>;
  };
}

export class CreatePolicyDto {
  @ApiProperty({ example: 'tenant-001' })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ example: 'ManageUsers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Grants permission to manage user accounts' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isSystemRole: boolean;

  @ApiProperty({ type: [PolicyStatementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyStatementDto)
  statements: PolicyStatementDto[];

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
