module.exports = {
  hello:
    'Welcome, my name is juju lang. I will assist you to improve your English.',
  chooseLang: {
    question: 'Now... Please choose your mother language.',
    options: [
      [
        {
          text: 'German',
          callback_data: 'lang de',
        },
        {
          text: 'French',
          callback_data: 'lang fr',
        },
        {
          text: 'Italian',
          callback_data: 'lang it',
        },
      ],
      [
        {
          text: 'Turkish',
          callback_data: 'lang tr',
        },
        {
          text: 'Russian',
          callback_data: 'lang ru',
        },
        {
          text: 'Chinese',
          callback_data: 'lang ch',
        },
      ],
    ],
  },
  meaning: [
    [
      {
        text: 'Translate',
        callback_data: 'translate',
      },
      {
        text: 'Save',
        callback_data: 'save',
      },
    ],
  ],
  chooseFirst: 'Please choose your mother language first.',
};
