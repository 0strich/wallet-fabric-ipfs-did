const { cleanObject } = require("./function");

const webResponse = (code, message = "", data = {}, errorData = {}) => {
  const response = {
    status: code,
    response: message,
    data,
    errorData,
  };

  if (code === 200) {
    response.response = "S00000";
  }

  return cleanObject(response);
};

module.exports = webResponse;
