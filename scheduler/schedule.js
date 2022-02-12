const moment = require('moment');

module.exports = {
  schedule,
};

async function schedule({ config, services }) {
  async function repetation() {
    const today = moment();
    console.log(today);

    // bring all saved words of users
    try {
      const words = await services.storageApi.getAllWords();
      words.forEach(async (x) => {
        const userId = x.userId?.userId;
        // console.log(x);
        if (!userId) return;
        // await sendMessageUsers(userId, x);
      });
    } catch (error) {
      console.log(error);
    }
    // If word saved time qualify for repeation send as telegram message
  }

  async function sendMessageUsers(userId, x) {
    await services.botService.bot.telegram.sendMessage(
      userId,
      x.word + ':\n' + x.meaning
    );
  }

  repetation();
  return { repetation };
}
