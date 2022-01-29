const mongoose = require('mongoose');

module.exports = {
  makeStorageService,
};

async function makeStorageService({ config }) {
  connect();

  async function connect() {
    try {
      await mongoose.connect(config.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log('Connected to DB succesfully');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
