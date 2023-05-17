const webResponse = require('./webResponse');

const createWebResp = (res, code, data) => {
  const response = webResponse(code, '', data);
  res.status(code).send(response);
};

const errorWebResp = (res, code, errorMessage, errorData) => {
  const response = webResponse(code, errorMessage, null, errorData);
  res.status(code).send(response);
};

module.exports = {
  createWebResp,
  errorWebResp,
};
