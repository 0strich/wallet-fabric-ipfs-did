// models
const Auths = require("models/auths/index");
const Admins = require("models/users/index");
// services
const service = require("services/index");
// utils
const cwr = require("utils/createWebResp");
const crypto = require("utils/crypto");
const payload = require("utils/payload");
const auths = require("utils/auths");
// errors
const { errors } = require("utils/errors/index");

// [관리자] 계정 유형 검증
const isAdmin = async (req, res, next) => {
  try {
    const { type } = req.decoded;

    if (type !== "admin") {
      return cwr.errorWebResp(res, 403, errors.E50000);
    }

    next();
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E50009, error.message);
  }
};

// [관리자] 회원가입
const postRegister = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, agreeService, agreePrivacy } =
      req.body;

    const docs = await service.readByEmail(Admins, email);

    if (!agreeService) {
      // 서비스 이용 동의 검증
      return cwr.errorWebResp(res, 403, errors.E50010);
    } else if (!agreePrivacy) {
      // 서비스 이용 동의 검증
      return cwr.errorWebResp(res, 403, errors.E50011);
    } else if (docs) {
      // 계정 유무
      return cwr.errorWebResp(res, 403, errors.E50012);
    } else if (password !== passwordConfirm) {
      // 동일 비밀번호 검증
      return cwr.errorWebResp(res, 403, errors.E50013);
    }

    // 비밀번호 해쉬 암호화
    const salt = crypto.saltGenerator();
    req.body.salt = salt;
    req.body.password = await crypto.toSha512Hash(password, salt);

    next();
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E50019, error.message);
  }
};

// [관리자] 로그인
const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 관리자 계정 조회
    const docs = await service.readByEmail(Admins, email);

    // 계정 유무 체크
    if (!docs) {
      return cwr.errorWebResp(res, 403, errors.E50020);
    }

    // 최근 인증 정보 조회
    const authPayload = { admin: docs?._id };
    const authDocs = await service.readOne(Auths, authPayload);

    // 비밀번호 잠김 확인(시간에 따른 해제)
    if (authDocs?.isLock) {
      const checkLock = await auths.checkIsLock(authDocs?._id);
      return cwr.errorWebResp(res, 429, checkLock);
    }

    // 비밀번호 일치 검증
    const { authValues } = docs;
    const { salt } = authValues;
    const isVerified = await crypto.verify(password, authValues.password, salt);

    if (!isVerified) {
      const lockTime = 60 * 3;
      const checkFail = await auths.failRecord(authDocs?._id, lockTime);
      return cwr.errorWebResp(res, 429, checkFail);
    }

    // 인증관련 해제
    const authUpdate = payload.authReset({});
    Object.assign(authDocs, authUpdate);
    await service.updateById(Auths, authDocs?._id, authDocs);

    next();
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E50029, error.message);
  }
};

// [관리자] 비밀번호 변경
const patchPassword = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // 관리자 계정 조회
    const { authValues } = await service.readById(Admins, id);
    const { password, salt } = authValues;
    const isVerified = await crypto.verify(oldPassword, password, salt);

    // 비밀번호 불일치
    if (!isVerified) {
      return cwr.errorWebResp(res, 403, errors.E50030);
    }

    // 비밀번호 확인 불일치
    if (newPassword !== confirmNewPassword) {
      return cwr.errorWebResp(res, 403, errors.E50031);
    }

    // 비밀번호 해쉬 암호화(재발행)
    const newSalt = crypto.saltGenerator();
    req.body.salt = newSalt;
    req.body.password = await crypto.toSha512Hash(newPassword, newSalt);

    next();
  } catch (error) {
    return cwe.errorWebResp(res, 403, errors.E50039, error.message);
  }
};

module.exports = {
  isAdmin,
  postRegister,
  postLogin,
  patchPassword,
};
