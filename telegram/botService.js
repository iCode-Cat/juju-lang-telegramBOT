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
  const {
    checkUserExists,
    registerUser,
    saveTemp,
    savePerm,
    getTempWord,
    saveUserWord,
  } = services.storageApi;
  const { getMeaningWord } = services.webScrapper;

  await chat();

  async function chat() {
    try {
      await bot.launch();
      bot.start(async (ctx) => {
        // Ask initial question for none-users
        if (await onUserNotExists(ctx)) return;
        // Greet users already exist
        bot.telegram.sendMessage(getUserId(ctx), 'Hi! Please type a word.');
      });

      await checkInlineQueries();

      // Send meaning on text
      bot.on('text', async (ctx) => {
        // Warn user who did not choose mother language yet
        if (await onUserNotExists(ctx)) return;
        const meaningWord = await getMeaningWord(getUserText(ctx));
        const userText = getUserText(ctx);
        if (meaningWord) {
          // Save temp word of user on text
          await saveTemp({
            userId: getUserId(ctx),
            word: userText,
            meaning: meaningWord,
          });
          // Translate word by user text
          bot.telegram.sendMessage(getUserId(ctx), meaningWord, {
            reply_markup: {
              inline_keyboard: [...dialog.meaning],
            },
          });
          // Save perm word
          await savePerm({ word: userText, meaning: meaningWord });
          return;
        }
        bot.telegram.sendMessage(getUserId(ctx), 'I could not find this word.');
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function onUserNotExists(ctx) {
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
      return true;
    }
    if (!checkUser) return true;
    return false;
  }

  async function checkInlineQueries() {
    bot.on('callback_query', async (ctx) => {
      switch (getCallBackData(ctx)) {
        case 'lang tr':
          await registerUser({
            userId: getCallBackDataUserId(ctx),
            lang: getCallBackData(ctx)
              .split('lang')[1]
              .replace(' ', ''),
          });
          bot.telegram.sendMessage(
            getCallBackDataUserId(ctx),
            'You choosen Turkish! Please enter a word.'
          );
          break;
        case 'save':
          const userId = getCallBackDataUserId(ctx);
          const getUser = await checkUserExists({ userId });
          const tempWord = await getTempWord({
            userId,
          });
          // save temp data to user word
          const userWord = await saveUserWord({
            word: tempWord.word,
            meaning: tempWord.meaning,
            userId: getUser._id,
          });
          if (userWord) {
            return bot.telegram.sendMessage(
              userId,
              'This word is already exists.'
            );
          }
          bot.telegram.sendMessage(
            userId,
            'You saved the word, you will get notification to repeat it.'
          );
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
