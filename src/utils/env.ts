import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  SUPABASE_PROJECT_URL: z.string().url(),
  SUPABASE_PUBLIC_ANON_KEY: z.string().min(1),
  ADMIN_TELEGRAM_ID: z.string().min(1),
  NODE_ENV: z.enum(["production", "development"]),
});

const env = envSchema.parse(process.env);

export default env;
