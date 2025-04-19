import { MediaType } from '../interfaces';

export const DetectedMediaTypes = (mimeType: string): MediaType => {
  if (mimeType.startsWith('image/')) {
    return MediaType.IMAGE;
  }
  if (mimeType.startsWith('video/')) {
    return MediaType.VIDEO;
  }
  if (mimeType.startsWith('audio/')) {
    return MediaType.AUDIO;
  }
  if (mimeType.startsWith('application')) {
    return MediaType.DOCUMENT;
  }
  return MediaType.OTHER;
};
