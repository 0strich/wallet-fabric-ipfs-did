// utils
const query = require("utils/query");
const { sortByLatest, updateOptions } = query;

// 생성
const create = async (model, data) => {
  const docs = await model.create(data);
  return docs;
};

// 조회(all)
const readAll = async (model) => {
  const docs = await model.find().sort(sortByLatest).lean();
  return docs;
};

// 다중 조회(_id)
const readById = async (model, id) => {
  const docs = await model.findById(id).sort(sortByLatest).lean();
  return docs;
};

// 단일 조회
const readOne = async (model, conditions) => {
  const docs = await model.findOne(conditions).sort(sortByLatest).lean();
  return docs;
};

// 조회(이메일)
const readByEmail = async (model, email) => {
  const conditions = { "authValues.email": email };
  const docs = await model.findOne(conditions).sort(sortByLatest).lean();
  return docs;
};

// 탐색(_id), 수정(data)
const updateById = async (model, id, data) => {
  const docs = await model
    .findByIdAndUpdate(id, data, updateOptions)
    .sort(sortByLatest)
    .lean();
  return docs;
};

// 탐색(email), 수정(data)
const updateByEmail = async (model, email, data) => {
  const conditions = { "authValues.email": email };
  const docs = await model
    .findByIdAndUpdate(conditions, data, updateOptions)
    .lean();
  return docs;
};

module.exports = {
  create,
  readAll,
  readById,
  readOne,
  readByEmail,
  updateById,
  updateByEmail,
};
