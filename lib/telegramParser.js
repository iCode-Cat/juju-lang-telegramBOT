module.exports.getUserId = (ctx) => {
  return ctx?.update?.message?.from?.id;
};

module.exports.getUserText = (ctx) => {
  return ctx?.update?.message?.text;
};

module.exports.getCallBackData = (ctx) => {
  return ctx.update.callback_query.data;
};

module.exports.getCallDeleteData = (ctx) => {
  const messageId = ctx.update.callback_query.message.message_id;
  const chatId = ctx.update.callback_query.message.chat.id;
  return {
    messageId,
    chatId,
  };
};

module.exports.getCallBackMessage = (ctx) => {
  return ctx.update.callback_query.message.text;
};

module.exports.getCallBackDataUserId = (ctx) => {
  return ctx.update.callback_query.from.id;
};
