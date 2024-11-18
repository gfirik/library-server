import { Bot } from "grammy";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import env from "../utils/env.ts";
import handleStart from "./commands/handleStart";
import handleMessage from "./commands/handleMessage.ts";
import handleError from "./errorHandler.ts";
import { handleChatMemberUpdates } from "./commands/handleChatMemberUpdate.ts";
import "./listeners/book.listener.ts";
import "./listeners/order.listener.ts";

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", handleStart);

bot.on("message", handleMessage);

bot.on("my_chat_member", handleChatMemberUpdates);

bot.catch(handleError);

bot.use(generateUpdateMiddleware());

export default bot;
