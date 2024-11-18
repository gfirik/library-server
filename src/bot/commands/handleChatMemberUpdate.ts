import { Context } from "grammy";
import { removeUserFromDatabase } from "../../supabase/removeUser.ts";
import env from "../../utils/env.ts";
import bot from "../main.ts";

const adminTelegramId = env.ADMIN_TELEGRAM_ID;

export const handleChatMemberUpdates = async (ctx: Context) => {
  const oldStatus = ctx.update.my_chat_member?.old_chat_member.status;
  const newStatus = ctx.update.my_chat_member?.new_chat_member.status;
  const userId = ctx.update.my_chat_member?.from.id;
  const userName = ctx.update.my_chat_member?.from.username;
  const firstname = ctx.update.my_chat_member?.from.first_name;

  console.log(
    `Chat member update: Old status: ${oldStatus}, New status: ${newStatus}`
  );

  if (oldStatus !== newStatus) {
    const isUserLeaving =
      newStatus === "kicked" ||
      (oldStatus === "member" &&
        (newStatus === "left" || newStatus === undefined));

    if (isUserLeaving) {
      console.log(
        `[my_chat_member] User ${userId} has ${
          newStatus === "kicked" ? "blocked" : "left or deleted"
        } the bot.`
      );
      if (userId !== undefined) {
        await removeUserFromDatabase(userId);

        let reason = "Noma'lum";
        if (newStatus === "kicked") {
          reason = "Botni blokladi";
        } else if (newStatus === "left" || newStatus === undefined) {
          reason = "Botdan chiqib ketdi yoki o'chirdi";
        }

        if (adminTelegramId) {
          const adminMessage = `<b>Foydalanuvchi o'chirildi</b>\n\nFoydalanuvchi nomi: ${firstname}\nFoydalanuvchi username: ${
            userName || "Noma'lum"
          }\nFoydalanuvchi ID: ${userId}\nSabab: ${reason}`;
          await bot.api.sendMessage(adminTelegramId, adminMessage, {
            parse_mode: "HTML",
          });
          console.log("Admin notified about user removal");
        }
      }
    }
  }
};
