import { createCloudinaryUrl } from '#/api/routes/cloudinary/cloudinary-url';

import type { ImagePropsDef } from './Images.types';

export const Image = (props: ImagePropsDef) => {
  const {
    alt,
    cropMode,
    height,
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
      className={`flex justify-center items-center size-full max-w-full max-h-full ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <img alt={alt} className="size-full object-contain" src={imgSrc} />
    </div>
  );
};
