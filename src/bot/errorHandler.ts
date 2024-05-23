import { Context, GrammyError, HttpError } from "grammy";
import { supabase } from "../supabase/supabase";

interface ErrorContext {
  ctx: Context;
  error: unknown;
}

const handleError = async (err: ErrorContext) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
    await handleSpecificTelegramError(e, ctx);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
    handleHttpError(e, ctx);
  } else {
    console.error("Unknown error:", e);
    handleUnknownError(e, ctx);
  }
};

const handleSpecificTelegramError = async (
  error: GrammyError,
  ctx: Context
) => {
  const errorCode = error.error_code;

  switch (errorCode) {
    case 403:
      console.error(`User has blocked the bot: ${ctx.from?.id}`);
      if (ctx.from?.id) {
        await removeUserFromDatabase(ctx.from.id);
      }
      break;
    case 404:
      console.error(`User not found: ${ctx.from?.id}`);
      if (ctx.from?.id) {
        await removeUserFromDatabase(ctx.from.id);
      }
      break;
    case 429:
      console.error("Too many requests: ", error.parameters?.retry_after);
      break;
    case 400:
      console.error("Bad request: ", error.description);
      break;
    default:
      console.error(
        `Telegram API returned error: ${errorCode} - ${error.description}`
      );
      break;
  }
};

const handleHttpError = (error: HttpError, ctx: Context) => {
  console.error("HTTP error occurred:", error);
};

const handleUnknownError = (error: unknown, ctx: Context) => {
  console.error("An unknown error occurred:", error);
};

const removeUserFromDatabase = async (userId: number) => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("telegram_user_id", userId);
  if (error) {
    console.error(`Failed to remove user ${userId} from database:`, error);
  } else {
    console.log(`User ${userId} removed from database.`);
  }
};

export default handleError;
