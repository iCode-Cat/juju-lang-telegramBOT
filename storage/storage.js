const User = require('./schema/User');

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
    try {
      const user = new User({ userId, lang });
      await user.save();
      console.log('New User Saved');
    } catch (error) {
      console.log(error);
    }
  }
  return {
    checkUserExists,
    registerUser,
  };
}
