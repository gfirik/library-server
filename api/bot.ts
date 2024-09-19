import { webhookCallback } from "grammy";
import { serve } from "bun";
import bot from "../src/bot/main";

const handleUpdate = webhookCallback(bot, "std/http");

serve({
  port: 6666,
  fetch(req) {
    return handleUpdate(req);
  },
});
