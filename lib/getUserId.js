const getUserId = (ctx) => {
  return ctx?.update?.message?.from?.id;
};
module.exports = getUserId;
