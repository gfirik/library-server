import { Bot, GrammyError } from "grammy";
import { removeUserFromDatabase } from "../supabase/removeUser.js";

export const sendMessageToUsers = async (
  bot: Bot,
  users: Array<{ telegram_user_id: number }>,
  message: string
) => {
  for (const user of users) {
    try {
      await bot.api.sendMessage(user.telegram_user_id, message, {
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error(
        `Error sending message to user ${user.telegram_user_id}`,
        error
      );

      if (error instanceof GrammyError) {
        if (error.error_code === 403) {
          console.error(
            `[sendMessage] User ${user.telegram_user_id} has blocked the bot. Removing from database.`
          );
          await removeUserFromDatabase(user.telegram_user_id);
        } else {
          console.error(`[sendMessage] GrammyError: ${error.description}`);
        }
      } else {
        console.error(`[sendMessage] An unknown error occurred:`, error);
      }
    }
  }
};
