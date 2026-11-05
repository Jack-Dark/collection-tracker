import type { UploadApiResponse } from 'cloudinary';

import { v4 as uuidv4 } from 'uuid';

import type { UploadFileToCloudinaryPropsDef } from './upload-file-to-cloudinary.types';

import { uploadChunkToCloudinaryServerFn } from '../../upload-chunk-to-cloudinary/upload-chunk-to-cloudinary.serverFn';

/**
 * Convert an ArrayBuffer to a base64 string without hitting the call-stack limit.
 *
 * The naive `btoa(String.fromCharCode(...new Uint8Array(buf)))` pattern spreads
 * potentially millions of arguments onto String.fromCharCode and blows the stack
 * for files larger than ~1 MB. This version processes 32 KB at a time instead.
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000; // 32 KB — safe call-stack size
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    parts.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
  }

  return btoa(parts.join(''));
};

export const uploadFileToCloudinary = async (
  props: UploadFileToCloudinaryPropsDef,
) => {
  try {
    const { file, tags } = props;

    // ? Chunk size: 1 MB. Small enough to avoid memory spikes; large enough to be fast.
    const chunkSize = 1 * 1024 * 1024;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const totalChunks = Math.max(1, Math.ceil(bytes.length / chunkSize));
    const uploadId = uuidv4();

    let photo: UploadApiResponse | null = null;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      // ? Uint8Array.slice() returns a copy with its own buffer — safe to pass directly
      const chunk = bytes.slice(start, start + chunkSize);
      const chunkBase64 = arrayBufferToBase64(chunk.buffer);

      const result = await uploadChunkToCloudinaryServerFn({
        data: {
          chunkBase64,
          chunkIndex: i,
          tags,
          totalChunks,
          uploadId,
        },
      });

      if (result !== null) {
        photo = result;
      }
    }

    if (photo) {
      return photo;
    } else {
      throw new Error('Upload completed but no photo was returned.');
    }
  } catch (err) {
    console.error('[Upload] failed:', err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Upload failed — check the server terminal for details.';

    throw new Error(message);
  }
};
