import { Bot } from "grammy";
import env from "../utils/env";
import handleStart from "./commands/handleStart";
import handleMessage from "./commands/handleMessage";
import handleError from "./errorHandler";
import { handleChatMemberUpdates } from "./commands/handleChatMemberUpdate";
import "./listener";

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", handleStart);

bot.on("message", handleMessage);

bot.on("my_chat_member", handleChatMemberUpdates);

bot.catch(handleError);

export default bot;
