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
}

const createResume = (counter, pages, write, ctx) => {
  const resume = `
    [RESUME]|[${pages} pages]

        Numeros de Requisições: [GET]
            Total: ${counter.getTotal()}
            Sucess: ${counter.getSucess()}
            Fail: ${counter.getFail()}

        Tempo de Execução:
            Total: ${counter.duration.total.toFixed(2)}s
            Média: ${counter.calcMedia().toFixed(2)}s
            
            Paginas: 
                Max: ${counter.getMaxDuration('pages')}s
                Min: ${counter.getMinDuration('pages')}s
            Produtos:
                Max: ${counter.getMaxDuration('prod')}s
                Min: ${counter.getMinDuration('prod')}s

        Erros:
            ${Object.entries(counter.errors)
              .map((el) => {
                return `${el[0]}: ${el[1]}`;
              })
              .join('\n')}

    `;
  write(resume);
  ctx.reply(resume);
};

module.exports = { Counter, createResume };
