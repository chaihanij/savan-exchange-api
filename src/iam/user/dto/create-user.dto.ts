import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../enums/account-type.enum';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  tel?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  roleUuids?: string[];

  @IsEnum(AccountType)
  @IsOptional()
  accountType?: AccountType;

  @IsString()
  @IsOptional()
  orgUuid?: string;
}
