import type { Context } from "grammy";

const handleMessage = (ctx: Context) => {
  const { from } = ctx;
  ctx.reply("Got another message!");
  console.log(`Message from: ${from?.id}`);
};

export default handleMessage;
