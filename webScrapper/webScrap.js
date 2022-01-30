const puppeteer = require('puppeteer');

module.exports = {
  makeWebScrapper,
};

async function makeWebScrapper() {
  const getMeaningWord = async (word) => {
    try {
      const domain = 'https://dictionary.cambridge.org';
      const language = '/us/dictionary/english/';
      const meaning =
        // eslint-disable-next-line max-len
        'div.ddef_h > div';
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(domain + language + word);
      const url = page.url();
      if (url === domain + language) {
        await browser.close();
        return 'I could not find that';
      }
      await page.waitForSelector(meaning);
      const element = await page.$(meaning);
      const value = await page.evaluate((el) => el.textContent, element);
      return value;
    } catch (error) {
      console.log(error);
    }
  };

  return { getMeaningWord };
}
