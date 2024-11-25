import { UserSchema } from "../../types/schemas.js";
import { supabase } from "../../supabase/supabase.js";
import { Context } from "grammy";
import env from "../../utils/env.js";
import bot from "../main.js";

const adminTelegramId = env.ADMIN_TELEGRAM_ID;

const handleStart = async (ctx: Context) => {
  const { from } = ctx;

  if (!from?.id) {
    console.error("Missing Telegram user ID. Cannot create user record.");
    return;
  }

  const userData = UserSchema.parse({
    telegram_user_id: from?.id,
    username: from?.username,
    firstname: from?.first_name,
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

      if (adminTelegramId) {
        const adminMessage = `<b>Yangi foydalanuvchi!</b>\n\nFoydalanuvchi nomi: ${
          from?.first_name
        }\nFoydalanuvchi username: ${
          from?.username || "no username"
        }\nFoydalanuvchi ID: ${from?.id}\n`;
        await bot.api.sendMessage(adminTelegramId, adminMessage, {
          parse_mode: "HTML",
        });
        console.log("Admin notified about new user registration");
      }
    }
  }

  console.log(`Start command from: ${from?.id}`);
};

export default handleStart;
