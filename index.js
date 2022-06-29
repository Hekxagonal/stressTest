const axios = require('./axios.config');
const generate = require('./generateUrl');
const log = require('./services/log');
const toTimeString = require('./services/handleTimeString');
const { Counter, createResume } = require('./services/createResume');
require('dotenv').config();

log.bot.start((botCtx) => {
  log.write('CONFIG', 'LogFilePath: ' + log.logFilePath);
  botCtx.reply('Starting Stress Test Bot!');
  botCtx.reply('Please enter the number of requests you want to make');
  log.bot.on('text', (ctx) => {
    const msg = ctx.message.text;
    let limit = 0;
    if (msg.match(/^[0-9]+$/)) {
      limit = parseInt(msg);
    } else {
      ctx.reply('Please enter a number');
      return;
    }

    const count = new Counter();

    count.setExpectedDuration(limit).then((resolve) => {
      log.write('CONFIG', 'Number of Pages: ' + limit);
      botCtx.reply('[CONFIG] Number of Pages: ' + limit);

      log.write(
        'CONFIG',
        'Tempo de execução maximo esperado: ' + toTimeString(resolve.max),
      );
      botCtx.reply(
        '[CONFIG] Tempo de execução maximo esperado: ' +
          toTimeString(resolve.max),
      );

      log.write('CONFIG', 'Tempo de execução minimo esperado: ' + resolve.min);
      botCtx.reply(
        '[CONFIG] Tempo de execução minimo esperado: ' +
          toTimeString(resolve.min),
      );

      log.write(
        'CONFIG',
        'Tempo de execução medio: ' + toTimeString(resolve.media),
      );
      botCtx.reply(
        '[CONFIG] Tempo de execução medio: ' + toTimeString(resolve.media),
      );
    });

    log.writeFileLog('CONFIG', 'Token: ' + process.env.AUTH_TOKEN + '\n');

    const StressTest = (qnt) => {
      log.write('LOOP', 'Starting Stress Test');
      botCtx.reply('Starting Stress Test...');

      log.breakLine();

      return new Promise(async (resolve) => {
        for (let i = 0; i < qnt; i++) {
          log.write('LOOP', 'Page Index: ' + i);

          log.write('CONFIG', 'Page URL: ' + generate.PageUrl(i + 1));
          await axios
            .get(generate.PageUrl(i + 1))
            .then(async (response) => {
              log.write('[GET]', '--current page:' + response.data.page);
              log.write(
                '[GET]',
                '----duration:' + response.duration / 1000 + 's',
              );
              count.setDuration('pages', response.duration / 1000);
              count.addSucess();

              if (response.data.data.length === 0) {
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
        resolve({ botCtx });
      });
    };

    log.bot.command('quit', (botCtx) => {
      botCtx.reply('Stress Test Bot Finished by User!');
      log.write('BOT', 'Stress Test Bot Finished by User!');
      process.abort();
    });

    StressTest(limit).then((resolve) => {
      createResume(count, limit, log.write, resolve.botCtx).then(() => {
        log.write('LOOP', 'Finish Stress Test');
        botCtx.reply('Finish Stress Test!');
        botCtx.replyWithDocument({ source: './logs/' + log.logFile });
      });
    });
  });
});

log.bot.launch();
