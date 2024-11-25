import type { VercelRequest, VercelResponse } from "@vercel/node";
import { webhookCallback } from "grammy";
import { run } from "@grammyjs/runner";
import bot from "./src/bot/main.js";
import env from "./src/utils/env.js";

// Adapter for Vercel's Request object
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      // Adapt Vercel's req/res to grammy's expectations
      const handler = webhookCallback(bot, "http");
      await handler(req, res); // Pass the adapted request and response
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
