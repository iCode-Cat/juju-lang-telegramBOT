const User = require('./schema/User');
const UserTemp = require('./schema/Temporary');
const Word = require('./schema/Word');
const UserWord = require('./schema/UserWord');

module.exports = {
  makeStorage,
};

async function makeStorage() {
  async function checkUserExists({ userId }) {
    try {
      const user = await User.findOne({ userId });
      if (user) return user;
      console.log('No user found');
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  async function registerUser({ userId, lang }) {
    if (await checkUserExists({ userId })) return;
    try {
      const user = new User({ userId, lang });
      await user.save();
      console.log('New User Saved');
    } catch (error) {
      console.log(error);
    }
  }

  async function removeUser({ userId }) {
    try {
      await User.deleteOne({ userId });
      console.log('User Removed ' + userId);
    } catch (error) {
      console.log(error);
    }
  }

  async function saveTemp({ userId, word, meaning }) {
    try {
      const findTemp = await UserTemp.findOne({ userId });
      if (findTemp) {
        return await UserTemp.updateOne({ userId }, { word, meaning });
      }
      await UserTemp.create({ userId, word, meaning });
    } catch (error) {
      console.log(error);
    }
  }

  async function savePerm({ word, meaning }) {
    // save word to perm store
    const searchPermWord = await Word.findOne({ word });
    if (!searchPermWord) {
      await Word.create({ word, meaning });
    }
  }

  async function saveUserWord({ word, meaning, userId }) {
    // save word to perm store
    const checkWord = await UserWord.findOne({ word });
    if (checkWord) return false;
    if (!checkWord) {
      await UserWord.create({ userId, word, meaning });
    }
  }

  async function getPermWord({ word }) {
    try {
      return await Word.findOne({ word });
    } catch (error) {
      console.log(error);
    }
  }

  async function getTempWord({ userId }) {
    try {
      return await UserTemp.findOne({ userId });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    checkUserExists,
    registerUser,
    removeUser,
    saveTemp,
    savePerm,
    getPermWord,
    getTempWord,
    saveUserWord,
  };
}
