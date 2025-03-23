import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../enums/account-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'admin',
    description: 'The username of user',
    required: false,
  })
  username?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'admin',
    description: 'The email of user',
    required: false,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '+6686686688',
    description: 'The telephone of user',
    required: false,
  })
  tel?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'The email of user',
    required: false,
  })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'John',
    description: 'The fristname of user',
    required: false,
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Doe',
    description: 'The lastname of user',
    required: false,
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'af5da2e1-d131-4155-8b15-439dbb13ad08',
    description: 'The role uuid of user',
    required: false,
  })
  roleUuids?: string[];

  @IsEnum(AccountType)
  @IsOptional()
  @ApiProperty({
    example: 4,
    description: 'The account type of user',
    required: false,
  })
  accountType?: AccountType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'af5da2e1-d131-4155-8b15-439dbb13ad08',
    description: 'The org uuid of user',
    required: false,
  })
  orgUuid?: string;
}
