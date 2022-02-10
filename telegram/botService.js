/* eslint-disable indent */
const { Telegraf } = require('telegraf');
const {
  getUserId,
  getUserText,
  getCallBackData,
  getCallBackDataUserId,
} = require('../lib/telegramParser');
const dialog = require('../dialog');
module.exports = {
  makeBotService,
};

async function makeBotService({ config, services }) {
  const bot = new Telegraf(config.TELEGRAM_TOKEN);
  const { checkUserExists, registerUser, removeUser } = services.storageApi;
  const { getMeaningWord } = services.webScrapper;

  await chat();

  async function chat() {
    try {
      await bot.launch();
      bot.start(async (ctx) => {
        return onUserNotExists(ctx);
      });

      await checkInlineQueries();

      // Send meaning on text
      bot.on('text', async (ctx) => {
        // Warn user who did not choose mother language yet
        if (await onUserNotExists(ctx, true)) return;
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

  async function onUserNotExists(ctx, secondStep = false) {
    const checkUser = await checkUserExists({
      userId: getUserId(ctx),
    });

    if (!checkUser) {
      if (secondStep) {
        bot.telegram.sendMessage(getUserId(ctx), dialog.chooseFirst, {
          reply_markup: {
            inline_keyboard: [...dialog.chooseLang.options],
          },
        });
        return;
      }
      // Send initial message to none members
      await ctx.reply(dialog.hello);
      bot.telegram.sendMessage(getUserId(ctx), dialog.chooseLang.question, {
        reply_markup: {
          inline_keyboard: [...dialog.chooseLang.options],
        },
      });
      return true;
    }
  }

  async function checkInlineQueries() {
    bot.on('callback_query', (ctx) => {
      const lang = getCallBackData(ctx).split('lang')[1].replace(' ', '');
      switch (getCallBackData(ctx)) {
        case 'lang tr':
          console.log('you chosen Turkish!');
          bot.telegram.sendMessage(
            getCallBackDataUserId(ctx),
            'You choosen Turkish!'
          );
          registerUser({ userId: getCallBackDataUserId(ctx), lang });
          break;
        default:
          break;
      }
    });
  }
  return {
    bot,
  };
}
