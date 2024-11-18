import { createClient } from "@supabase/supabase-js";
import env from "../utils/env.ts";

export const supabase = createClient(
  env.SUPABASE_PROJECT_URL,
  env.SUPABASE_PUBLIC_ANON_KEY
);
