const puppeteer = require('puppeteer');

module.exports = {
  makeWebScrapper,
};

async function makeWebScrapper() {
  const getMeaningWord = async (lang) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://dictionary.cambridge.org');
      await page.screenshot({ path: 'example.png' });

      await browser.close();
    } catch (error) {
      console.log(error);
    }
  };

  return { getMeaningWord };
}
