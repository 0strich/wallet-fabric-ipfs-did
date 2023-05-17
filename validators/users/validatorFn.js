const { validationResult } = require("express-validator");
const cwr = require("utils/createWebResp");

const returnParamVD = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = { code: "E11000", message: result.array()[0].msg };
    cwr.errorWebResp(res, 403, error, result.array());
  } else {
    next();
  }
};

module.exports = {
  returnParamVD,
};
