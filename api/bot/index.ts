import { webhookCallback } from "grammy";
import { serve } from "bun";
import bot from "./main";

const handleUpdate = webhookCallback(bot, "http");

serve({
  fetch(req) {
    return handleUpdate(req);
  },
  port: 6666,
});
