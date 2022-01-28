const { makeStorageService } = require('./storage/storageService');

module.exports = {
  run,
};

const services = {
  storageService: null,
  storageApi: null,
};

async function run() {
  services.storageService = await makeStorageService();
}
