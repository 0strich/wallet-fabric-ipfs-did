// 최신순 정렬
const sortByLatest = {createdAt: -1};

// 수정 옵션
const updateOptions = {upsert: true, new: true, useFindAndModify: false};

module.exports = {sortByLatest, updateOptions};
