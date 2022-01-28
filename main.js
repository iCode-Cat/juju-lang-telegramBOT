const { makeStorageService } = require('./storage/storageService');
const { makeBotService } = require('./telegram/botService');
require('dotenv').config();

const config = process.env;

module.exports = {
  run,
};

const services = {
  storageService: null,
  storageApi: null,
  botService: null,
};

async function run() {
  services.storageService = await makeStorageService({ config });
  services.botService = await makeBotService({ config, services });
}
