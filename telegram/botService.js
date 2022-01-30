/* eslint-disable indent */
const { Telegraf } = require('telegraf');
const { getUserId, getUserText } = require('../lib/telegramParser');
const dialog = require('../dialog');
module.exports = {
  makeBotService,
};

async function makeBotService({ config, services }) {
  const bot = new Telegraf(config.TELEGRAM_TOKEN);
  const { checkUserExists, registerUser, removeUser } = services.storageApi;
  const { getMeaningWord } = services.webScrapper;

  chat();

  async function chat() {
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
      // Send meaning on text
      bot.on('text', async (ctx) => {
        // Translate word by user text
        bot.telegram.sendMessage(
          getUserId(ctx),
          await getMeaningWord(getUserText(ctx)),
          {
            reply_markup: {
              inline_keyboard: [...dialog.meaning],
            },
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    bot,
  };
}
