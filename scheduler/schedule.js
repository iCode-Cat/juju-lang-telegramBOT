const moment = require('moment');

module.exports = {
  schedule,
};

const addDays = (x, day) => {
  return moment(x.time)
    .add(day, 'days')
    .format('MM-DD-YY');
};

async function schedule({ config, services }) {
  const sentWords = [];
  async function repetation() {
    const today = moment().format('MM-DD-YY');
    const time = moment().format('HH');
    // bring all saved words of users
    try {
      const words = await services.storageApi.getAllWords();
      const repetation = words.map(async (x) => {
        const wordAfter1D = addDays(x, 1);
        const wordAfter7D = addDays(x, 7);
        const wordAfter14D = addDays(x, 16);
        const wordAfter35D = addDays(x, 35);

        const userId = x.userId?.userId;
        if (!userId) return;
        // Time range
        if (time !== config.SEND_TIME) return;
        // repeat logic
        switch (today) {
          case wordAfter1D:
            repeatHandler({
              obj: x,
              userId,
              actualPhase: 1,
              nextPhase: 7,
            });
            break;
          case wordAfter7D:
            repeatHandler({
              obj: x,
              userId,
              actualPhase: 7,
              nextPhase: 16,
            });
            break;
          case wordAfter14D:
            repeatHandler({
              obj: x,
              userId,
              actualPhase: 16,
              nextPhase: 35,
            });
            break;
          case wordAfter35D:
            repeatHandler({
              obj: x,
              userId,
              actualPhase: 35,
              nextPhase: 36,
            });
            break;
          default:
            break;
        }
      });
      await Promise.all(repetation);
      // Update phaes
      await phaseHandler();
    } catch (error) {
      console.log(error);
    }
    // If word saved time qualify for repeation send as telegram message
  }

  async function sendMessageUsers(userId, x) {
    await services.botService.bot.telegram.sendMessage(userId, x.meaning, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Translate',
              callback_data: 'translate',
            },
            {
              text: '✔️',
              callback_data: 'delete',
            },
          ],
        ],
      },
    });
  }

  async function repeatHandler({ obj, userId, nextPhase, actualPhase }) {
    if (obj.phase !== actualPhase) return;
    sentWords.push({ id: obj._id, nextPhase });
    await sendMessageUsers(userId, obj);
  }

  async function phaseHandler() {
    const update = sentWords.map(async (x) => {
      await services.storageApi.updateWordPhase({
        id: x.id,
        nextPhase: x.nextPhase,
      });
    });
    await Promise.all(update);
    sentWords.length = 0;
  }

  repetation();
  setInterval(() => {
    repetation();
  }, 1000 * 60 * 20);
  return { repetation };
}
