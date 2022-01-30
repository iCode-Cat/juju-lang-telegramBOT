module.exports.getUserId = (ctx) => {
  return ctx?.update?.message?.from?.id;
};

module.exports.getUserText = (ctx) => {
  return ctx?.update?.message?.text;
};
