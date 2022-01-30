module.exports = {
  hello:
    'Welcome, my name is juju lang. I will assist you to improve your English.',
  chooseLang: {
    question: 'Now... Please choose your mother language.',
    options: [
      [
        {
          text: 'German',
          callback_data: 'de',
        },
        {
          text: 'French',
          callback_data: 'fr',
        },
        {
          text: 'Italian',
          callback_data: 'it',
        },
      ],
      [
        {
          text: 'Turkish',
          callback_data: 'tr',
        },
        {
          text: 'Russian',
          callback_data: 'ru',
        },
        {
          text: 'Chinese',
          callback_data: 'ch',
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
};
