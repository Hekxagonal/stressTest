class Counter {
    total = 0;
    sucess = 0;
    fail = 0;
    duration = {
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

    setMaxDuration(type, duration) {
        if (this.duration[type].max < duration) {
            this.duration[type].max = duration;
        }
    }

    setMinDuration(type, duration) {
        if (this.duration[type].min > duration) {
            this.duration[type].min = duration;
        }
    }

    getMaxDuration(type) {
        return this.duration[type].max;
    }

    getMinDuration(type) {
        return this.duration[type].min;
    }
}

const createResume = (counter, pages, write, ctx) => {
    const resume =  `
    [RESUME]|[${pages} pages]

        Numeros de Requisições: [GET]
            Total: ${counter.getTotal()}
            Sucess: ${counter.getSucess()}
            Fail: ${counter.getFail()}

        Tempo de Execução:
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