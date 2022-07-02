const ProdUrl = (codpro) => {
  return `http://192.168.0.87:3333/stocks/detail?vcodemp=1&vcodfil=1&vcodpro=${codpro}&vcodder=+`;
};

const PageUrl = (page) => {
  return `http://192.168.0.87:3333/products?page=${page}&limit=12&codfil=1&prod=`;
};

module.exports = { ProdUrl, PageUrl };
