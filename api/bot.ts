import { webhookCallback } from "grammy";
import { run } from "@grammyjs/runner";
import bot from "./src/bot/main.js";
import env from "./src/utils/env.js";

const handler = webhookCallback(bot, "std/http");
export default handler;

console.log("Webhook server running...");

if (env.NODE_ENV === "development") {
  run(bot);
  console.log("Bot started locally. For testing, ensure to connect via ngrok.");
}
