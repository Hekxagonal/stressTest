class Counter {
    total = 0;
    sucess = 0;
    fail = 0;
    duration = {
        total: 0,
        media: 0,
        pages: { max: 0, min:0, },
        prod: { max: 0, min:0, },
    }

    constructor() {}

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
        if (this.duration[type].min > duration) {
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
    };
}

const createResume = (counter, pages, write, ctx) => {
    const resume =  `
    [RESUME]|[${pages} pages]

        Numeros de Requisições: [GET]
            Total: ${counter.getTotal()}
            Sucess: ${counter.getSucess()}
            Fail: ${counter.getFail()}

        Tempo de Execução:
            Total: ${counter.duration.total.toFixed(2)}s
            Média: ${counter.calcMedia().toFixed(2)}s
            
            Paginas: 
                Max: ${counter.getMaxDuration("pages")}s
                Min: ${counter.getMinDuration("pages")}s
            Produtos:
                Max: ${counter.getMaxDuration("prod")}s
                Min: ${counter.getMinDuration("prod")}s

    `;
    write(resume);
    ctx.reply(resume);
}

module.exports = { Counter, createResume }