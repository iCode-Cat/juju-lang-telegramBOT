const { Telegraf } = require('telegraf');
const getUserId = require('../lib/getUserId');
const dialog = require('../dialog');
module.exports = {
  makeBotService,
};

async function makeBotService({ config, services }) {
  const bot = new Telegraf(config.TELEGRAM_TOKEN);
  const { checkUserExists, registerUser, removeUser } = services.storageApi;
  // INIT BOT

  try {
    bot.launch();
    bot.start(async (ctx) => {
      const checkUser = await checkUserExists({
        userId: getUserId(ctx),
      });

      if (!checkUser) {
        // Send initial message to none members
        await ctx.reply(dialog.hello);
        bot.telegram.sendMessage(getUserId(ctx), dialog.chooseLang.question, {
          reply_markup: {
            inline_keyboard: [...dialog.chooseLang.options],
          },
        });
        return;
      }
    });
  } catch (error) {
    console.log(error);
  }

  return {
    bot,
  };
}
