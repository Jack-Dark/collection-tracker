import type { BaseImagePropsDef } from '../Image/Images.types';

export type ZoomableThumbnailGalleryPropsDef = {
  alt: string;
  images: BaseImagePropsDef[];
  index: number;
  thumbnail: BaseImagePropsDef;
};
