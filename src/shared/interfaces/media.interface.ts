export enum VisibilityEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other',
}

export interface MediaInterface {
  _id?: string;
  mediaId: string;
  fileName: string;
  mimeType: string;
  size: number;
  key: string;
  url: string;
  visibility: VisibilityEnum;
  ownerId: string;
  createdAt?: Date;
}
