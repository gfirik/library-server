import type { Context } from "grammy";

const handleMessage = (ctx: Context) => {
  const { from } = ctx;
  ctx.reply(`Hozircha ushbu botda yuborgan xabaringiz bilan to'g'ridan to'g'ri ishlash imkoniyati mavjud emas. 
    \nIltimos kitobni ijaraga olish uchun menyu qismidagi ilovadan foydalaning!`);
  console.log(`Message from: ${from?.id}`);
};

export default handleMessage;
