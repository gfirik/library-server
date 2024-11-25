import { supabase } from "../supabase/supabase.js";

export const removeUserFromDatabase = async (userId: number) => {
  console.log(
    `[Database] Attempting to remove user ${userId} from database...`
  );
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("telegram_user_id", userId);
  if (error) {
    console.error(
      `[Database] Failed to remove user ${userId} from database:`,
      error
    );
  } else {
    console.log(`[Database] User ${userId} removed from database.`);
  }
};
