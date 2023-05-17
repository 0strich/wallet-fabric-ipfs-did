// models
const Auths = require("models/auths/index");
// services
const service = require("services/index");
// utils
const cwr = require("utils/createWebResp");
const query = require("utils/query");
const fn = require("utils/function");
const jwt = require("jsonwebtoken");
// errors
const { errors } = require("utils/errors/index");

// 계정 잠김 상태
const checkIsLock = async (id) => {
  // 계정 조회
  const docs = await service.readById(Auths, id);

  // 현재 시간 > 재로그인 가능 시간
  const now = new Date();
  if (now <= docs?.authReleaseAt) {
    return errors.E50022(fn.diffDate(now, docs?.authReleaseAt));
    // TODO: 잠김 에러 리턴
  } else {
    // 잠김 해제, 실패 횟수 1
    const isLock = false;
    const failCount = 1;
    const params = { isLock, failCount };

    Object.assign(docs, params);
    await service.updateById(Auths, id, docs);

    return errors.E50021(failCount);
  }

  return errors.E90000;
};

// 인증 실패
const failRecord = async (id, lockTime) => {
  // 계정 조회
  const docs = await service.readById(Auths, id);
  const addFailCount = docs?.failCount + 1; // 인증시도 실패 추가

  // 인증 실패 수 >= 인증 시도 가능 횟수(3분 잠김)
  if (addFailCount >= docs?.limitCount) {
    const authReleaseAt = fn.addSecondsDate(lockTime);
    const failCount = 0;
    const isLock = true;
    const params = { authReleaseAt, failCount, isLock };

    Object.assign(docs, params);
    await service.updateById(Auths, id, docs);
    return errors.E50022(lockTime);
  } else {
    // 인증 시도 실패 카운트 추가
    const params = { failCount: addFailCount };
    Object.assign(docs, params);
    await service.updateById(Auths, id, docs);
    return errors.E50021(addFailCount);
  }

  return errors.E90000;
};

module.exports = {
  checkIsLock,
  failRecord,
};
