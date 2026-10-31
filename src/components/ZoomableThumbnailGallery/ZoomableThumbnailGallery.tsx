import { Tabs } from '@base-ui/react';
import { useState } from 'react';
import { twJoin } from 'tailwind-merge';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';

import type { BaseImagePropsDef } from '../Image/Images.types';
import type { ZoomableThumbnailGalleryPropsDef } from './ZoomableThumbnailGallery.types';

import { Dialog } from '../Dialog';
import { useDialog } from '../Dialog/hooks/useDialog';
import { Image } from '../Image';

export const ZoomableThumbnailGallery = (
  props: ZoomableThumbnailGalleryPropsDef,
) => {
  const { alt, className, images, index, thumbnail } = props;

  const [activeIndex, setActiveIndex] = useState<number>(index);

  const altText = `${alt} ${index + 1}`;

  const [showDialog, hideDialog] = useDialog(() => {
    return (
      <Dialog
        Header={alt}
        maxWidthClassName="md:max-w-max"
        onClose={hideDialog}
      >
        <Tabs.Root
          className="grid gap-2"
          onValueChange={setActiveIndex}
          value={activeIndex}
        >
          <Tabs.List className="min-w-80 flex flex-wrap items-center justify-center gap-1 p-1 pt-2">
            {images.map((image, index) => {
              const key = image.publicId || image.src;

              const altText = `${alt} ${index + 1}`;

              const isPublicId = !!image.publicId;

              const thumbnail: BaseImagePropsDef = isPublicId
                ? ({
                    cropMode: 'pad',
                    height: thumbnailSize,
                    publicId: image.publicId,
                    width: thumbnailSize,
                  } satisfies BaseImagePropsDef)
                : ({ src: image.src! } satisfies BaseImagePropsDef);

              return (
                <Tabs.Tab
                  className={twJoin(
                    'border border-theme-divider-2 size-15 p-0.5',
                    'data-active:border-theme-link-hover cursor-pointer',
                  )}
                  key={key}
                  value={index}
                >
                  <Image {...thumbnail} alt={altText} />
                </Tabs.Tab>
              );
            })}
          </Tabs.List>

          {images.map((image, index) => {
            const key = image.publicId || image.src;
            const altText = `${alt} ${index + 1}`;

            return (
              <Tabs.Panel
                className="h-full"
                keepMounted
                key={key}
                value={index}
              >
                <Image
                  {...image}
                  alt={altText}
                  className="rounded-2xl overflow-hidden *:object-top"
                />
              </Tabs.Panel>
            );
          })}
        </Tabs.Root>
      </Dialog>
    );
  }, [images, activeIndex]);

  return (
    <Image
      className={className}
      objectFit="cover"
      {...thumbnail}
      alt={altText}
      onClick={showDialog}
    />
  );
};
