const { Telegraf, Markup } = require('telegraf');

// Ваш токен бота (НЕ публикуйте его в открытом доступе!)
const bot = new Telegraf('7638357741:AAEPNwwE6cIFXS0_E1ygzAWSrpCIn8MZE9s');

// Замените на ваш реальный адрес после деплоя на Vercel!
const WEB_APP_URL = 'https://notes-app-lake-two.vercel.app/';

bot.start((ctx) => {
  ctx.reply(
    'Откройте приложение заметок:',
    Markup.keyboard([
      [Markup.button.webApp('Открыть заметки', WEB_APP_URL)]
    ]).resize()
  );
});

bot.command('notes', (ctx) => {
  ctx.reply(
    'Откройте приложение заметок:',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть заметки', WEB_APP_URL)
    ])
  );
});

bot.launch();
console.log('Бот запущен!');