const toTimeString = require('./handleTimeString');

const calcMedia = (counter) => {
  counter.duration.media = counter.duration.total / counter.total;
  if (counter.writeJSON) counter.writeJSON();
  return counter.duration.media;
};

const createResume = (counter, write) => {
  return new Promise((resolve) => {
    const resume = `
    [RESUME]|[${counter.limit} pages]

        Config:
            Posts por Pagina: 12
              Valores estimados:
                Numero de Requisições esperadas: ${counter.limit * 12}
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
            Total: ${counter.total}
            Sucess: ${counter.sucess}
            Fail: ${counter.fail}

        Tempo de Execução:
            Total: ${toTimeString(counter.duration.total)}
            Média: ${toTimeString(calcMedia(counter))}
            
            Paginas: 
                Max: ${toTimeString(counter.duration.pages.max)}
                Min: ${toTimeString(counter.duration.pages.min)}
            Produtos:
                Max: ${toTimeString(counter.duration.prod.max)}
                Min: ${toTimeString(counter.duration.prod.min)}
        ${Object.keys(counter.errors).length > 0 ? '        \n Erros:' : ''}
            ${Object.entries(counter.errors)
              .map((el) => {
                return `${el[0]}: ${el[1]}`;
              })
              .join('    \n')}

    `;
    write(resume);

    resolve({ resume });
  });
};

module.exports = createResume;
