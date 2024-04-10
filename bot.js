 import TelegramBot from 'node-telegram-bot-api';

 const bot = new TelegramBot('', {polling: true});
 
 export default bot