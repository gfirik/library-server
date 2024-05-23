import { Bot } from "grammy";
import env from "../utils/env";
import handleStart from "./commands/handleStart";
import handleMessage from "./commands/handleMessage";
import handleError from "./errorHandler";

const bot = new Bot(env.BOT_TOKEN);

bot.command("start", handleStart);

bot.on("message", handleMessage);

bot.catch(handleError);

export default bot;
