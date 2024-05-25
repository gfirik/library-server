import { Context } from "grammy";
import { removeUserFromDatabase } from "../../supabase/removeUser";

export const handleChatMemberUpdates = async (ctx: Context) => {
  const oldStatus = ctx.update.my_chat_member?.old_chat_member.status;
  const newStatus = ctx.update.my_chat_member?.new_chat_member.status;

  if (oldStatus !== newStatus) {
    const userId = ctx.update.my_chat_member?.from.id;
    if (newStatus === "kicked" || newStatus === "left") {
      console.log(
        `[my_chat_member] User ${userId} has blocked or left the bot.`
      );
      if (userId !== undefined) {
        await removeUserFromDatabase(userId);
      }
    }
  }
};
