const { makeStorageService } = require('./storage/storageService');
const { makeBotService } = require('./telegram/botService');
const { makeStorage } = require('./storage/storage');
const { makeWebScrapper } = require('./webScrapper/webScrap');
const { schedule } = require('./scheduler/schedule');
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
  schedule: null,
};

async function run() {
  services.storageService = await makeStorageService({ config });
  services.storageApi = await makeStorage();
  services.webScrapper = await makeWebScrapper({ config, services });
  services.botService = await makeBotService({ config, services });
  services.schedule = await schedule({ config, services });
}

// setInterval(async () => {
//   services.schedule.repetation();
// }, 1000 * 10);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log('server started'));
