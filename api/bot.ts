import { webhookCallback } from "grammy";
import { run } from "@grammyjs/runner";
import bot from "../src/bot/main";
import env from "../src/utils/env";

const handler = webhookCallback(bot, "std/http");

export default async function (req: any, res: any) {
  if (req.method === "POST") {
    await handler(req);
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

if (env.NODE_ENV !== "production") {
  run(bot);
  console.log("Bot started locally. For testing, ensure to connect via ngrok.");
}
