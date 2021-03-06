const puppeteer = require('puppeteer');

module.exports = {
  makeWebScrapper,
};

async function makeWebScrapper({ services }) {
  const getMeaningWord = async (word) => {
    // When word already exist just return that
    const permWord = await services.storageApi.getPermWord({ word });
    if (permWord) return permWord.meaning;
    try {
      const domain = 'https://dictionary.cambridge.org';
      const language = '/us/dictionary/english/';
      const meaning =
        // eslint-disable-next-line max-len
        'div.ddef_h > div';
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        waitUntil: 'domcontentloaded',
      });
      const page = await browser.newPage();
      await page.goto(domain + language + word);
      const url = page.url();
      if (url === domain + language) {
        await browser.close();
        return false;
      }
      await page.waitForSelector(meaning);
      const element = await page.$(meaning);
      const value = await page.evaluate((el) => el.textContent, element);

      await browser.close();
      return `-${word}- ${value}`;
    } catch (error) {
      console.log(error);
    }
  };

  return { getMeaningWord };
}
