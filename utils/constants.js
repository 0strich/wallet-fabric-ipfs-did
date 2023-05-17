const emptyTypes = [undefined, null, NaN, false, {}, []];
const emptyTypeString = ['undefined', 'null', 'NaN', 'false', '{}', '[]', ''];
const emptyElements = [...emptyTypes, ...emptyTypeString];

module.exports = {
  emptyElements,
};
