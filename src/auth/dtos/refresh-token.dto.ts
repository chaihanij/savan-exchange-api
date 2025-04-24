import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token to be used for refreshing the access token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiProperty({
    description: 'The ID of the device from which the refresh token is being requested.',
    example: 'device123',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
