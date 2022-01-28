const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
  makeStorageService,
};

async function makeStorageService() {
  connect();

  async function connect() {
    try {
      await mongoose.connect(process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log('Connected to DB succesfully');
    } catch (error) {
      console.log(error);
    }
  }
}
