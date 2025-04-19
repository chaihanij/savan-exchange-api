import { VisibilityEnum } from '../../shared/interfaces';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaDto {
  @ApiProperty({ enum: VisibilityEnum, default: VisibilityEnum.PUBLIC })
  @IsEnum(VisibilityEnum)
  visibility: VisibilityEnum = VisibilityEnum.PUBLIC;
}
