const toTimeString = require('./handleTimeString');

class Counter {
  constructor() {
    this.total = 0;
    this.sucess = 0;
    this.fail = 0;
    this.duration = {
      total: 0,
      media: 0,
      pages: { max: 0, min: 0 },
      prod: { max: 0, min: 0 },
      expected: { max: 0, min: 0, media: 0 },
    };
    this.errors = {};
  }

  getTotal() {
    return this.total;
  }

  getSucess() {
    return this.sucess;
  }

  getFail() {
    return this.fail;
  }

  addSucess() {
    this.sucess = this.sucess + 1;
    this.total = this.total + 1;
  }

  addFail() {
    this.fail = this.fail + 1;
    this.total = this.total + 1;
  }

  setDuration(type, duration) {
    if (this.duration[type].max < duration) {
      this.duration[type].max = duration;
    }
    if (this.duration[type].min === 0 || this.duration[type].min > duration) {
      this.duration[type].min = duration;
    }
    this.duration.total = this.duration.total + duration;
  }

  getMaxDuration(type) {
    return this.duration[type].max;
  }

  getMinDuration(type) {
    return this.duration[type].min;
  }

  calcMedia() {
    this.duration.media = this.duration.total / this.total;
    return this.duration.media;
  }

  addError(type) {
    if (!this.errors[type]) {
      this.errors[type] = 0;
    }
    this.errors[type] = this.errors[type] + 1;
  }

  setExpectedDuration(loopLimit) {
    return new Promise((resolve) => {
      // tempo em segundos
      const maxRegistred = { page: 76.958, prod: 0.402 };
      const minRegistred = { page: 0.402, prod: 0.155 };

      this.duration.expected.max =
        maxRegistred.page * loopLimit + 12 * maxRegistred.prod;
      this.duration.expected.min =
        minRegistred.page * loopLimit + 12 * minRegistred.prod;
      this.duration.expected.media =
        this.duration.expected.max + this.duration.expected.min / 2;

      resolve({
        max: this.duration.expected.max,
        min: this.duration.expected.min,
        media: this.duration.expected.media,
      });
    });
  }
}

const createResume = (counter, pages, write, ctx) => {
  return new Promise((resolve) => {
    const resume = `
    [RESUME]|[${pages} pages]

        Config:
            Posts por Pagina: 12
              Valores estimados:
                Numero de Requisições esperadas: ${pages * 12}
                Tempo máximo de espera: ${toTimeString(
                  counter.duration.expected.max,
                )}
                Tempo minimo de espera: ${toTimeString(
                  counter.duration.expected.min,
                )}
                Tempo medio de espera: ${toTimeString(
                  counter.duration.expected.media,
                )}
        
        Numeros de Requisições: [GET]
            Total: ${counter.getTotal()}
            Sucess: ${counter.getSucess()}
            Fail: ${counter.getFail()}

        Tempo de Execução:
            Total: ${toTimeString(counter.duration.total)}
            Média: ${toTimeString(counter.calcMedia())}
            
            Paginas: 
                Max: ${toTimeString(counter.getMaxDuration('pages'))}
                Min: ${toTimeString(counter.getMinDuration('pages'))}
            Produtos:
                Max: ${toTimeString(counter.getMaxDuration('prod'))}
                Min: ${toTimeString(counter.getMinDuration('prod'))}
        ${Object.keys(counter.errors).length > 0 ? '\n Erros:' : ''}
            ${Object.entries(counter.errors)
              .map((el) => {
                return `${el[0]}: ${el[1]}`;
              })
              .join('    \n')}

    `;
    write(resume);
    ctx.reply(resume);

    resolve({ resume });
  });
};

module.exports = { Counter, createResume };
