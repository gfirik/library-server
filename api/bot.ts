import { webhookCallback } from "grammy";
import { run } from "@grammyjs/runner";
import bot from "../src/bot/main.js";
import env from "../src/utils/env.js";

if (env.NODE_ENV === "production") {
  const handler = webhookCallback(bot, "std/http");

  Bun.serve({
    async fetch(req) {
      if (req.method === "POST") {
        return await handler(req);
      } else {
        return new Response("Method Not Allowed", { status: 405 });
      }
    },
    port: 3333,
    development: false,
  });

  console.log("Webhook server running on port 3333");
} else {
  run(bot);
  console.log("Bot started locally. For testing, ensure to connect via ngrok.");
}
