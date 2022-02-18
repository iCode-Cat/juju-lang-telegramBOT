const { translate } = require('free-translate');
const translateWord = async (word) => {
  const translatedText = await translate(word, { from: 'en', to: 'tr' });
  // こんにちは世界
  return translatedText;
};
module.exports = translateWord;
