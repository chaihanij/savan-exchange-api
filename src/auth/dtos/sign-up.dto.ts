import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'admin',
    description: 'The username of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'The password of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'admin@admin.com',
    description: 'The email of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Nguyen',
    description: 'The first name of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Van',
    description: 'The last name of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tel: string;
}
