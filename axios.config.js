const axios = require('axios');

axios.interceptors.response.use(
  function (response) {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  },
);

axios.defaults.headers.common = {
  Authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cG9ydGUiLCJzdWIiOjEsImlhdCI6MTY1NjQ1MzA3OSwiZXhwIjoxNjU2NTM5NDc5fQ.yb5sqFYPEmw6t6lddoCB03ctmS4xx2-O9Dbq3VW_F8M`,
};

axios.interceptors.request.use(
  function (config) {
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

module.exports = axios;
