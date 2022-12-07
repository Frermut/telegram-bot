const TelegramApi = require('node-telegram-bot-api');
const token = '5428942355:AAFBkARxv2UlXJE94UkE37guJvOL3nQ5IrY';
const {gameOptions, againOptions} = require('./options');
const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай!`, gameOptions);
}


bot.setMyCommands([
    {command: '/start', description: "Начальное приветствие"},
    {command: '/game', description: "Сможешь угадать цифру?"},
    {command: '/schedule', description: "Узнай расписание"},
    {command: '/info', description: "Тестовая информация"},


])

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            // await bot.sendSticker(chatId, '');
            // const admin = '[<Admin>](<https://t.me/Frermut>)';
            return bot.sendMessage(chatId,`Добро пожаловать в бота 20-ПРО-1.

${msg.from.first_name}, бот находится в разработке, поэтому могут случаться различного рода баги.

Чтобы они быстрее исправлялись пишите в лс админу.`);
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}!`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        if (text === '/schedule') {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            return [
                bot.sendMessage(chatId, `Сегодня: ${today}

Расписание: `),
                bot.sendPhoto(chatId, `./img/Расписание/schedule.jpg`),
        ]
        }

        return bot.sendMessage(chatId, `Я тебя не понял!`);
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(data);
        if (data === '/again'){
            return startGame(chatId);
        }

        if(data == chats[chatId]) {
            return [
                bot.sendSticker(chatId, `CAACAgIAAxkBAAEGu3RjkQiSpBlCjkIvO4Xg8zNyurMFnAACTREAAvyjCUi0LM2wP-WzAisE`),
                bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions),
            ] 
        } else {
            return bot.sendMessage(chatId, `Неправильно! Я загадывал: ${chats[chatId]}`, againOptions);
        }

        
    })
}

start();