import { config } from 'dotenv';

config({ path: '.env' });

export const configs = {
  betterAuthUrl: process.env.BETTER_AUTH_URL!,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY!,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET!,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET!,
  dbUrl: process.env.DATABASE_URL!,
  /** ```ts
   * 'development' | 'production'
   * ``` */
  environment: process.env.NODE_ENV!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID!,
  resendApiKey: process.env.RESEND_API_KEY!,
} as const;
