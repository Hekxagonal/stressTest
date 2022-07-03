const fs = require('fs');
const createResume = require('./services/resume');

if (process.argv.length !== 8) {
  console.log(
    'Usage: node create-resume.js <day> <month> <year> <hour> <minutes> <seconds>',
  );
  process.exit(1);
}

if (!process.argv[2]) {
  console.error('Insira uma pasta como argumento do script');
  process.exit(9);
}

const folder = `${process.argv[2]}_${process.argv[3]}_${process.argv[4]}-${process.argv[5]}_${process.argv[6]}_${process.argv[7]}`;
console.log('|' + folder + '|');

const path = `./logs/${folder}`;

const json = `${path}/data.json`;

if (!fs.existsSync(json)) {
  console.log('A pasta não existe ou não existe um arquivo de dados');
  process.exit(9);
}

const data = require(json);

createResume(data, (resume) => {
  fs.writeFile(path + '/resume.txt', resume, (err) => {
    if (err) {
      console.log(err);
    }
  });
});
