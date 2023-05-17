// models
const Auths = require("models/auths/index");
// utils
const query = require("utils/query");
const { sortByLatest, updateOptions } = query;

// 탐색(계정 ID), 최신
const readOneByAccountId = async (docs) => {
  return docs;
};

module.exports = {
  readOneByAccountId,
};
