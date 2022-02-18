/* eslint-disable indent */
const { Telegraf } = require('telegraf');
const {
  getUserId,
  getUserText,
  getCallBackData,
  getCallBackDataUserId,
  getCallBackMessage,
  getCallDeleteData,
} = require('../lib/telegramParser');
const dialog = require('../dialog');
const translateWord = require('../lib/translate');
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
          const meaningMsg = await bot.telegram.sendMessage(
            getUserId(ctx),
            meaningWord,
            {
              reply_markup: {
                inline_keyboard: [...dialog.meaning],
              },
            }
          );
          setTimeout(() => {
            bot.telegram.deleteMessage(
              meaningMsg.chat.id,
              meaningMsg.message_id
            );
          }, 1000 * 60 * 5);
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
            const warn = await bot.telegram.sendMessage(
              userId,
              'This word is already exists.'
            );
            setTimeout(() => {
              bot.telegram.deleteMessage(warn.chat.id, warn.message_id);
            }, 5000);
            return;
          }
          const saved = await bot.telegram.sendMessage(
            userId,
            'You saved the word, you will get notification to repeat it.'
          );
          setTimeout(() => {
            bot.telegram.deleteMessage(saved.chat.id, saved.message_id);
          }, 5000);
          console.log(saved);
          break;
        case 'translate':
          const word = getCallBackMessage(ctx).slice(
            1,
            getCallBackMessage(ctx).lastIndexOf('-')
          );
          const translated = await translateWord(word);
          const translateMstg = await bot.telegram.sendMessage(
            getCallBackDataUserId(ctx),
            word + ':' + translated
          );

          setTimeout(() => {
            bot.telegram.deleteMessage(
              translateMstg.chat.id,
              translateMstg.message_id
            );
          }, 1000 * 60 * 5);

          // 1ateWord()
          break;
        case 'delete':
          bot.telegram.deleteMessage(
            getCallDeleteData(ctx).chatId,
            getCallDeleteData(ctx).messageId
          );

          // 1ateWord()
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
