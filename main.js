const { makeStorageService } = require('./storage/storageService');
const { makeBotService } = require('./telegram/botService');
const { makeStorage } = require('./storage/storage');
const { makeWebScrapper } = require('./webScrapper/webScrap');
const express = require('express');
const app = express();
require('dotenv').config();

const config = process.env;

module.exports = {
  run,
};

const services = {
  storageService: null,
  storageApi: null,
  botService: null,
  webScrapper: null,
};

async function run() {
  services.storageService = await makeStorageService({ config });
  services.storageApi = await makeStorage();
  services.webScrapper = await makeWebScrapper({ config, services });
  services.botService = await makeBotService({ config, services });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server started'));
