import { webhookCallback } from "grammy";
import bot from "./src/bot/main";

const handler = webhookCallback(bot, "std/http");

export default async function (req: Request) {
  if (req.method === "POST") {
    try {
      await handler(req);
      return new Response("OK", { status: 200 });
    } catch (error) {
      return new Response("Error handling the webhook", { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
