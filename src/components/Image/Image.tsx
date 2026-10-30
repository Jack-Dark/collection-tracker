import { twMerge } from 'tailwind-merge';

import { createCloudinaryUrl } from '#/api/routes/cloudinary/cloudinary-url';

import type { ImagePropsDef } from './Images.types';

export const Image = (props: ImagePropsDef) => {
  const {
    alt,
    className,
    cropMode,
    height,
    objectFit = 'contain',
    onClick,
    publicId,
    src,
    transformations = [],
    width,
  } = props;

  let imgSrc = src;

  if (publicId) {
    imgSrc = createCloudinaryUrl(
      {
        cropMode,
        height,
        publicId,
        width,
      },
      ...transformations,
    );
  }

  return (
    <div
      className={twMerge(
        'flex justify-center items-center size-full max-w-full max-h-full',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <img
        alt={alt}
        className={twMerge(
          'size-full',
          objectFit === 'contain' ? 'object-contain' : 'object-cover',
        )}
        src={imgSrc}
      />
    </div>
  );
};
