import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin',
    description: 'The username of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: 'admin',
    description: 'The email of user',
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+6686686688',
    description: 'The telephone of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  tel?: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'The password of user',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'John',
    description: 'The fristname of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The lastname of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'superAdmin',
    description: 'The type of user',
    required: false,
  })
  @IsEnum(UserType)
  @IsString()
  @IsOptional()
  userType: UserType;

  @ApiProperty({
    example: 'af5da2e1-d131-4155-8b15-439dbb13ad08',
    description: 'The organization of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  organizationUuid?: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The create by user of user',
    required: false,
  })
  createdByUuid?: string;
}
