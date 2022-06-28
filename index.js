const axios = require('./axios.config');
const generate = require('./generateUrl');
const log = require('./services/log');
const { Counter, createResume } = require('./services/createResume');
require('dotenv').config();

const controller = new AbortController();

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

    log.write('CONFIG', 'Number of Pages: ' + limit);
    botCtx.reply('[CONFIG] Number of Pages: ' + limit);

    log.writeFileLog('CONFIG', 'Token: ' + process.env.AUTH_TOKEN + '\n');

    const count = new Counter();

    const StressTest = (qnt) => {
      log.write('LOOP', 'Starting Stress Test');
      botCtx.reply('Starting Stress Test...');

      log.breakLine();

      return new Promise(async (resolve) => {
        for (let i = 0; i < qnt; i++) {
          log.write('LOOP', 'Page Index: ' + i);

          await axios
            .get(generate.PageUrl(i + 1), { signal: controller.signal })
            .then(async (response) => {
              log.write('[GET]', '--current page:' + response.data.page);
              log.write(
                '[GET]',
                '----duration:' + response.duration / 1000 + 's',
              );
              count.setDuration('prod', response.duration / 1000);
              count.addSucess();

              response.data.data.forEach((prod, index) => {
                axios
                  .get(generate.ProdUrl(prod.codpro), {
                    signal: controller.signal,
                  })
                  .then((res) => {
                    log.write('GET', `[${count.total}] Sucess!`);
                    log.write(`----get index: [${index}]`);
                    log.write(`------codpro: ${prod.codpro}`);
                    log.write('------duration: ' + res.duration / 1000 + 's');
                    count.setDuration('prod', res.duration / 1000);
                    count.addSucess();

                    log.breakLine();
                  })
                  .catch((e) => {
                    log.write('GET', `[${count.total}] Fail`);
                    log.write(
                      'ERROR',
                      'in getProd ' + e.statusText || 'No error statusText',
                    );
                    log.write('duration: ' + e.duration / 1000 + 's');
                    count.setDuration('prod', e.duration / 1000);

                    count.addFail();
                  });
              });
            })
            .catch((e) => {
              log.write('ERROR', 'in getProdList');
              log.write('--code: ' + e.code);
              log.write('--duration: ' + e.duration / 1000 + 's');

              count.setDuration('prod', e.duration / 1000);
              count.addFail();
            });
        }
        resolve({ botCtx });
      });
    };

    log.bot.command('quit', (botCtx) => {
      controller.abort();
      botCtx.reply('Stress Test Bot Finished by User!');
      log.write('BOT', 'Stress Test Bot Finished by User!');
    });

    StressTest(limit).then((resolve) => {
      log.write('LOOP', 'Finish Stress Test');
      botCtx.reply('Finish Stress Test!');
      createResume(count, limit, log.write, resolve.botCtx);
      botCtx.replyWithDocument({ source: './logs/' + log.logFile });
    });
  });
});

log.bot.launch();
