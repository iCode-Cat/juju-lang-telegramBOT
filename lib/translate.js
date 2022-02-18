const { translate } = require('bing-translate-api');
const translateWord = async (word) => {
  try {
    const transWord = await translate(word, 'en', 'tr', true);
    return transWord.translation;
  } catch (error) {}

  // こんにちは世界
};
module.exports = translateWord;
