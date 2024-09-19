import { z } from "zod";

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  SUPABASE_PROJECT_URL: z.string().url(),
  SUPABASE_PUBLIC_ANON_KEY: z.string().min(1),
  ADMIN_TELEGRAM_ID: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
