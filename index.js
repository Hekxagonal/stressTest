const axios = require("./axios.config");
const generate = require("./generateUrl");
const log = require("./services/log");
require("dotenv").config();

log.write("CONFIG", "LogFilePath: " + log.logFilePath);

const limit = Number(process.env.LOOP_LIMIT);

log.write("LOOP", "Limit: " + limit);
log.write("CONFIG", "Number of Pages: " + limit);

log.writeFileLog("CONFIG", "Token: " + process.env.AUTH_TOKEN + "\n");

const StressTest = (qnt) => {
  log.write("LOOP", "Starting Stress Test");

  log.breakLine();

  let count = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < qnt; i++) {
      log.write("LOOP", "Index: " + i);

      axios
        .get(generate.PageUrl(i + 1))
        .then((response) => {
          log.write("[GET]", "--current page:" + response.data.page);

          response.data.data.forEach((prod, index) => {
            axios
              .get(generate.ProdUrl(prod.codpro))
              .then((res) => {
                count = count + 1;
                log.write("GET", `[${count}] Sucess!`);
                log.write(`----get index: [${index}]`);
                log.write(`------codpro: ${prod.codpro}`);
                log.write("------duration: " + res.duration / 1000 + "s");

                log.breakLine();
              })
              .catch((e) => {
                count = count + 1;
                log.write("GET", `[${count}] Fail`);
                log.write(
                  "ERROR",
                  "in getProd " + e.statusText || "No error statusText"
                );
                log.write("duration: " + e.duration / 1000 + "s");
              });
          });
        })
        .catch((e) => {
          log.write("ERROR", "in getProdList");
          log.write("--code: " + e.code);
          log.write("--duration: " + e.duration / 1000 + "s");
        });
    }
  })
    .then(() => {
      log.stream.end();
      log.write("LOOP", "Finish Sucess Stress Test");
    })
    .catch((e) => {
      log.stream.end();
      log.write("ERROR", `in Loop [${i}]`);
      log.write("LOOP", "Finish Fail Stress Test");
      log.write(e.code);
    });
};
StressTest(limit);
