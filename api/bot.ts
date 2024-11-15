import { webhookCallback } from "grammy";
import bot from "./src/bot/main.js";

const handler = webhookCallback(bot, "std/http");

export default async function (req: Request) {
  if (req.method === "POST") {
    try {
      console.log("Webhook received a request! Processing... \n");
      await handler(req);
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error handling webhook:", error);
      return new Response("Error handling the webhook", { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
