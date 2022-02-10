module.exports.getUserId = (ctx) => {
  return ctx?.update?.message?.from?.id;
};

module.exports.getUserText = (ctx) => {
  return ctx?.update?.message?.text;
};

module.exports.getCallBackData = (ctx) => {
  // update: {
  //   update_id: 189896691,
  //   callback_query: {
  //     id: '3202061443742604356',
  //     from: [Object],
  //     message: [Object],
  //     chat_instance: '7496881265901503098',
  //     data: 'tr'
  //   }
  // },

  return ctx.update.callback_query.data;
};

module.exports.getCallBackDataUserId = (ctx) => {
  return ctx.update.callback_query.from.id;
};
