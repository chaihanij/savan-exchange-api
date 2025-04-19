import { ApiProperty } from '@nestjs/swagger';
import { VisibilityEnum } from '../../shared/interfaces/media.interface';

export class MediaResponseDto {
  @ApiProperty() mediaId: string;
  @ApiProperty() fileName: string;
  @ApiProperty() mimeType: string;
  @ApiProperty() size: number;
  @ApiProperty() key: string;
  @ApiProperty({ required: false }) url?: string;
  @ApiProperty({ enum: VisibilityEnum }) visibility: VisibilityEnum;
  @ApiProperty({ required: false }) ownerId?: string;
  @ApiProperty() createdAt: Date;
}
