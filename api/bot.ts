import type { VercelRequest, VercelResponse } from "@vercel/node";
import { webhookCallback } from "grammy";
import { run } from "@grammyjs/runner";
import bot from "./src/bot/main.js";
import env from "./src/utils/env.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const handler = webhookCallback(bot, "https");
      await handler(req, res);
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

console.log("Webhook server running...");

if (env.NODE_ENV === "development") {
  run(bot);
  console.log("Bot started locally. For testing, ensure to connect via ngrok.");
}
