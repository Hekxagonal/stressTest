if (!process.argv[2]) {
  console.error('Insira um numero de paginas');
  process.exit(9);
}

if (isNaN(Number(process.argv[2])) || Number(process.argv[2]) < 1) {
  console.error('O numero de paginas deve ser um numero maior que 0');
  process.exit(9);
}

const axios = require('./axios.config');
const generate = require('./generateUrl');
const log = require('./services/log');
const toTimeString = require('./services/handleTimeString');
const Counter = require('./services/counter');
const createResume = require('./services/resume');
require('dotenv').config();

const limit = process.argv[2];

log.write('CONFIG', 'LogFilePath: ' + log.logFilePath);

const count = new Counter();
count.setLimit(Number(limit));

count.setExpectedDuration(limit).then((resolve) => {
  log.write('CONFIG', 'Number of Pages: ' + limit);

  log.write(
    'CONFIG',
    'Tempo de execução maximo esperado: ' + toTimeString(resolve.max),
  );

  log.write(
    'CONFIG',
    'Tempo de execução minimo esperado: ' + toTimeString(resolve.min),
  );

  log.write(
    'CONFIG',
    'Tempo de execução medio: ' + toTimeString(resolve.media),
  );
});

log.writeFileLog('CONFIG', 'Token: ' + process.env.AUTH_TOKEN + '\n');

const StressTest = (qnt) => {
  log.breakLine();
  log.write('LOOP', 'Starting Stress Test');

  log.breakLine();

  return new Promise(async (resolve) => {
    for (let i = 0; i < qnt; i++) {
      log.write('LOOP', 'Page Index: ' + i);

      log.write('CONFIG', 'Page URL: ' + generate.PageUrl(i + 1));
      await axios
        .get(generate.PageUrl(i + 1))
        .then(async (response) => {
          log.write('[GET]', '--current page:' + response.data.page);
          log.write('[GET]', '----duration:' + response.duration / 1000 + 's');
          count.setDuration('pages', response.duration / 1000);
          count.addSucess();

          if (
            response.data &&
            response.data.data &&
            response.data.data.length === 0
          ) {
            count.addError('EmptyPage');
          }

          response.data.data.forEach((prod, index) => {
            axios
              .get(generate.ProdUrl(prod.codpro))
              .then((res) => {
                log.write('GET', `[${count.total}] Sucess!`);
                log.write(`----get index: [${index}]`);
                log.write(`------codpro: ${prod.codpro}`);
                log.write(
                  '------duration: ' + toTimeString(res.duration / 1000),
                );
                count.setDuration('prod', res.duration / 1000);
                count.addSucess();

                log.breakLine();
              })
              .catch((e) => {
                log.write('GET', `[${count.total}] Fail`);
                log.write(
                  'ERROR',
                  `in getProd: | ${e.code} |  ${e.message} | ${e.msg} | ${e.statusText}`,
                );
                count.addError(e.code);
                log.write('duration: ' + toTimeString(e.duration / 1000));
                count.setDuration('prod', e.duration / 1000);

                count.addFail();
              });
          });
        })
        .catch((e) => {
          log.write('ERROR', 'in getProdList');
          log.write(
            `'--code: | ${e.code} |  ${e.message} | ${e.msg} | ${e.statusText}`,
          );
          count.addError(e.code);
          log.write('--duration: ' + toTimeString(e.duration));

          count.setDuration('pages', e.duration / 1000);
          count.addFail();
        });
    }
    resolve();
  });
};

StressTest(limit).then(() => {
  createResume(count, log.write).then(() => {
    log.write('LOOP', 'Finish Stress Test');
  });
});
