import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PolicyStatementDto } from './create-policy.dto';

export class PolicyResponseDto {
  @ApiProperty({ example: 'policy-001' })
  policyId: string;

  @ApiProperty({ example: 'tenant-001' })
  tenantId?: string;

  @ApiProperty({ example: 'ManageUsers' })
  name: string;

  @ApiPropertyOptional({ example: 'Grants permission to manage user accounts' })
  description?: string;

  @ApiProperty({ example: false })
  isSystemRole: boolean;

  @ApiProperty({ type: [PolicyStatementDto] })
  statements: PolicyStatementDto[];

  @ApiProperty({ example: '2025-04-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-10T12:00:00.000Z' })
  updatedAt: Date;
}
