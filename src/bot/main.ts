import { Bot, GrammyError, HttpError } from "grammy";
import env from "../utils/env";
import { UserSchema } from "../db/schemas";
import { supabase } from "../db/supabase";

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", async (ctx) => {
  const { from } = ctx;

  if (!from?.id) {
    console.error("Missing Telegram user ID. Cannot create user record.");
    return;
  }

  const userData = UserSchema.parse({
    telegram_user_id: from?.id,
    username: from?.username,
  });
  console.log(userData);

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
        `Welcome ${from?.first_name}! \n\Start the web app from menu button to use our library!.`
      );
    }
  }

  console.log(`Start command from: ${from?.id}`);
});

bot.on("message", (ctx) => {
  const { from } = ctx;
  ctx.reply("Got another message!");
  console.log(`Message from: ${from?.id}`);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

export default bot;
