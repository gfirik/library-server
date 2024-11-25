import { Bot } from "grammy";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import env from "../utils/env.js";
import handleStart from "./commands/handleStart.js";
import handleMessage from "./commands/handleMessage.js";
import handleError from "./errorHandler.js";
import { handleChatMemberUpdates } from "./commands/handleChatMemberUpdate.js";
import "./listeners/book.listener.js";
import "./listeners/order.listener.js";

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", handleStart);

bot.on("message", handleMessage);

bot.on("my_chat_member", handleChatMemberUpdates);

bot.catch(handleError);

bot.use(generateUpdateMiddleware());

export default bot;
