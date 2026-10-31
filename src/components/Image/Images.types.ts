import type { CropMode } from 'cloudinary';

export type ImagePropsDef = {
  alt: string;
  onClick?: () => void;
} & BaseImagePropsDef;

export type BaseImagePropsDef =
  | {
      cropMode?: never;
      height?: never;
      publicId?: never;
      src: string;
      transformations?: never;
      width?: never;
    }
  | {
      cropMode?: CropMode;
      height?: number;
      publicId: string;
      src?: never;
      transformations?: string[];
      width?: number;
    };
