const fs = require("fs");


const currentDate = new Date();
const logFile = `${currentDate.getDate()}_${currentDate.getMonth()}_${currentDate.getFullYear()}-${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}.txt`;
const logFilePath = "./logs/" + logFile;

fs.writeFile(logFilePath, "[Stress Test] Starting... \n", (err) => {
    if (err) {
      throw err;
    }
    console.log("[LOG] File created!");
  });


const stream = fs.createWriteStream(logFilePath, { flags: "a" });

const write = (prefix, msg) => {
    const text = !!msg ? `[${prefix}] ${msg}` : prefix;
    console.log(text);
    stream.write(text + "\n");
};

const breakLine = () => {
    console.log("");
    stream.write("\n");
}

const writeFileLog = (msg) => {
    stream.write(msg + "\n");
}

module.exports = { currentDate, logFile, logFilePath, stream, write, breakLine, writeFileLog };