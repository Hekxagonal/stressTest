const fs = require('fs');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const currentDate = new Date();
const logFile = `${currentDate.getDate()}_${currentDate.getMonth()}_${currentDate.getFullYear()}-${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}.txt`;
const logFilePath = './logs/' + logFile;

const stream = fs.createWriteStream(logFilePath, { flags: 'a' });

const write = (prefix, msg) => {
  const text = msg ? `[${prefix}] ${msg}` : prefix;
  console.log(text);
  stream.write(text + '\n');
};

fs.writeFile(logFilePath, '[Stress Test] Starting... \n', (err) => {
  if (err) {
    throw err;
  }
  console.log('[LOG] File created!');
  write('BOT', 'Waiting Start...');
});

const bot = new Telegraf(process.env.BOT_TOKEN);

const breakLine = () => {
  console.log('');
  stream.write('\n');
};

const writeFileLog = (msg) => {
  stream.write(msg + '\n');
};

module.exports = {
  currentDate,
  logFile,
  logFilePath,
  stream,
  write,
  breakLine,
  writeFileLog,
  bot,
};
