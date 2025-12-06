import fs from 'fs';
import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('⚠️  .env file not found. Please create one based on .env.example');
  process.exit(1);
} else {
  dotenv.config();
}

// Compare .env with .env.example
const envFile = fs.readFileSync(envPath, 'utf8');
const envLines = envFile
  .split('\n')
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split('=')[0].trim());

const examplePath = path.resolve(process.cwd(), '.env.example');
const exampleKeys = fs.existsSync(examplePath)
  ? fs
      .readFileSync(examplePath, 'utf8')
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split('=')[0].trim())
  : [];

const missingKeys = exampleKeys.filter((key) => !envLines.includes(key));
if (missingKeys.length > 0) {
  console.error(
    `⚠️  Missing environment variables from .env:\n   ${missingKeys.join(
      ', '
    )}\nPlease update your .env file to match .env.example`
  );
  process.exit(1);
}

const extraKeys = envLines.filter((key) => !exampleKeys.includes(key));
if (extraKeys.length > 0) {
  console.warn(
    `⚠️  Extra variables found in .env (not in .env.example):\n   ${extraKeys.join(
      ', '
    )}\nThese will be ignored.`
  );
}

// Zod schema for validation
const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  CLIENT_URI: z.string().url('CLIENT_URI must be a valid URL'),
  SERVER_URI: z.string().url('SERVER_URI must be a valid URL'),
  CORS_ORIGINS: z.string().min(1, 'CORS_ORIGINS is required'),
  CLERK_WEBHOOK_SECRET: z.string().min(1, 'CLERK_WEBHOOK_SECRET is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n⚠️  Invalid environment variable values:\n');
  Object.entries(parsed.error.format()).forEach(([key, value]) => {
    if (value && '_errors' in value && value._errors.length > 0) {
      console.error(`   ${key}: ${value._errors.join(', ')}`);
    }
  });
  console.error('\nPlease fix the above errors in your .env file.');
}

let config: {
  PORT: number;
  MONGO_URI: string;
  CLIENT_URI: string;
  SERVER_URI: string;
  CORS_ORIGINS: string;
  CLERK_WEBHOOK_SECRET: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
};

if (parsed.success) {
  const {
    PORT,
    MONGO_URI,
    CLIENT_URI,
    SERVER_URI,
    CORS_ORIGINS,
    CLERK_WEBHOOK_SECRET,
    CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY,
  } = parsed.data;

  config = {
    PORT: parseInt(PORT, 10),
    MONGO_URI,
    CLIENT_URI,
    SERVER_URI,
    CORS_ORIGINS,
    CLERK_WEBHOOK_SECRET,
    CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY,
    CLOUDINARY_API_KEY: parsed.data.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: parsed.data.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: parsed.data.CLOUDINARY_CLOUD_NAME,
  };
} else {
  config = {} as any;
}

export { config };
