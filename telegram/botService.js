const { Telegraf } = require('telegraf');
const getUserId = require('../lib/getUserId');
module.exports = {
  makeBotService,
};

async function makeBotService({ config, services }) {
  // INIT BOT
  const bot = new Telegraf(config.TELEGRAM_TOKEN);
  try {
    bot.launch();
    bot.start(async (ctx) => {
      ctx.reply('Welcome, my name is JUJU');
      bot.telegram.sendMessage(getUserId(ctx), 'HELLO');
      const checkUser = await services.storageApi.checkUserExists({
        userId: getUserId(ctx),
      });
      if (!checkUser) {
        await services.storageApi.registerUser({
          userId: getUserId(ctx),
          lang: 'eng',
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  return {
    bot,
  };
}
