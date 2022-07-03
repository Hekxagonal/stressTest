const fs = require('fs');
require('dotenv').config();

const currentDate = new Date();

const date = {
  day: currentDate.getDate().toString().padStart(2, '0'),
  month: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
  year: currentDate.getFullYear(),
  hour: currentDate.getHours().toString().padStart(2, '0'),
  minute: currentDate.getMinutes().toString().padStart(2, '0'),
  second: currentDate.getSeconds().toString().padStart(2, '0'),
};
const dir = `./logs/${date.day}_${date.month}_${date.year}-${date.hour}_${date.minute}_${date.second}`;
const logFile = `log.txt`;
const logFilePath = `${dir}/${logFile}`;

try {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
} catch (err) {
  console.error(err);
}

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

const breakLine = () => {
  console.log('');
  stream.write('\n');
};

const writeFileLog = (msg) => {
  stream.write(msg + '\n');
};

module.exports = {
  currentDate,
  dir,
  logFile,
  logFilePath,
  stream,
  write,
  breakLine,
  writeFileLog,
};
