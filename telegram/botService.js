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
    bot.start((ctx) => {
      console.log(ctx.update.message.from);
      ctx.reply('Welcome, my name is JUJU');
      bot.telegram.sendMessage(getUserId(ctx), 'HELLO');
    });
  } catch (error) {
    console.log(error);
  }

  return {
    bot,
  };
}
