import { UserSchema } from "../../types/schemas";
import { supabase } from "../../supabase/supabase";
import { Context } from "grammy";

const handleStart = async (ctx: Context) => {
  const { from } = ctx;

  if (!from?.id) {
    console.error("Missing Telegram user ID. Cannot create user record.");
    return;
  }

  const userData = UserSchema.parse({
    telegram_user_id: from?.id,
    username: from?.username,
  });

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_user_id", from?.id)
    .maybeSingle();

  if (fetchError) {
    console.log("Error fetching user", fetchError);
    return;
  }

  if (existingUser) {
    await ctx.reply(`Welcome back, ${from?.first_name}!`);
  } else {
    const { data, error } = await supabase.from("users").insert([userData]);
    if (error) {
      console.error("Error saving user data:", error);
    } else {
      console.log("User data saved to Supabase:", data);
      await ctx.reply(
        `Welcome ${from?.first_name}! \n\nStart the web app from menu button to use our library!.`
      );
    }
  }

  console.log(`Start command from: ${from?.id}`);
};

export default handleStart;
