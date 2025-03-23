import { Type } from 'class-transformer';
import { ArrayUnique, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Action } from '../enums/action.enum';
import { Resource } from '../enums/resource.enum';
import { IPermission } from '../interfaces/permission';
import { ApiProperty } from '@nestjs/swagger';

export class Permission implements IPermission {
  @IsEnum(Resource)
  @ApiProperty({
    description: 'The resource of role',
    enum: Resource,
    example: 'settings',
  })
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  @ApiProperty({
    description: 'The actions of role',
    enum: Action,
    isArray: true,
    example: ['read', 'create'],
  })
  actions: Action[];
}

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    example: 'admin',
    description: 'The name of role',
  })
  name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Permission)
  @ApiProperty({
    description: 'The permissions of role',
    type: Permission,
    isArray: true,
  })
  permissions: Permission[];
}
