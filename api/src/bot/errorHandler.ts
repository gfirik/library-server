import { Context, GrammyError, HttpError } from "grammy";
import { removeUserFromDatabase } from "../supabase/removeUser.js";

interface ErrorContext {
  ctx: Context;
  error: unknown;
}

const handleError = async (err: ErrorContext) => {
  const ctx = err.ctx;
  console.error(
    `[ErrorHandler] Error while handling update ${ctx.update.update_id}:`
  );
  console.error(`[ErrorHandler] Context: ${JSON.stringify(ctx)}`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error(`[ErrorHandler] GrammyError in request: ${e.description}`);
    await handleSpecificTelegramError(e, ctx);
  } else if (e instanceof HttpError) {
    console.error(`[ErrorHandler] HttpError: Could not contact Telegram:`, e);
    handleHttpError(e, ctx);
  } else {
    console.error(`[ErrorHandler] Unknown error:`, e);
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
      console.error(`[ErrorHandler] User has blocked the bot: ${ctx.from?.id}`);
      if (ctx.from?.id) {
        await removeUserFromDatabase(ctx.from.id);
      }
      break;
    case 404:
      console.error(`[ErrorHandler] User not found: ${ctx.from?.id}`);
      if (ctx.from?.id) {
        await removeUserFromDatabase(ctx.from.id);
      }
      break;
    case 429:
      console.error(
        `[ErrorHandler] Too many requests: `,
        error.parameters?.retry_after
      );
      break;
    case 400:
      console.error(`[ErrorHandler] Bad request: `, error.description);
      break;
    default:
      console.error(
        `[ErrorHandler] Telegram API returned error: ${errorCode} - ${error.description}`
      );
      break;
  }
};

const handleHttpError = (error: HttpError, ctx: Context) => {
  console.error(`[ErrorHandler] HTTP error occurred:`, error);
};

const handleUnknownError = (error: unknown, ctx: Context) => {
  console.error(`[ErrorHandler] An unknown error occurred:`, error);
};

export default handleError;
