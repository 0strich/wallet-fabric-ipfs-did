const { cleanObject } = require("./function");

/* AUTH */
// 인증 상태 초기화
const authReset = (object) => {
  return cleanObject({
    failCount: 0,
    isLock: false,
  });
};

const auth = (object) => {
  return cleanObject({
    type: object?.authType,
    authorized: object?.authorized,
  });
};

// 인증 실패
const authFailed = (object) => {
  return cleanObject({
    failCount: object?.failCount,
    isLock: object?.isLock,
    triedAt: Date.now(),
  });
};

/* USERS */
// 인증 정보(로그인)
const userCredentials = (object) => {
  return cleanObject({
    name: object?.name,
    email: object?.email,
    password: object?.password,
    salt: object?.salt,
  });
};

// 프로필
const profile = (object) => {
  return cleanObject({
    name: object?.name,
    phoneNumber: object?.phoneNumber,
    position: object?.position,
    age: object?.age,
  });
};

// 설정
const settings = (object) => {
  return cleanObject({
    version: object?.version,
  });
};

// 약관
const terms = (object) => {
  return cleanObject({
    agreeService: object?.agreeService,
    agreePrivacy: object?.agreePrivacy,
  });
};

// 회원가입 정보
const register = (object) => {
  return cleanObject({
    ...userCredentials(object),
    // userCredentials: { ...userCredentials(object) },
    // profile: { ...profile(object) },
    // settings: { ...settings(object) },
    // terms: { ...terms(object) },
  });
};

// 프로필 정보(노출)
const profileInfo = (object) => {
  return {
    email: object?.userCredentials?.email,
    name: object?.profile?.name,
    phoneNumber: object?.profile?.phoneNumber,
    position: object?.profile?.position,
    age: object?.profile?.age,
  };
};

// jwt access token
const accessToken = (object1, object2) => {
  return cleanObject({
    id: object1?._id,
    authId: object2?._id,
    type: object1?.type,
  });
};

// accessToken 재발행
const reissueAccessToken = (object) => {
  return cleanObject({
    id: object?.id,
    authId: object?.authId,
    type: object?.type,
  });
};

module.exports = {
  /* AUTH */
  authReset,
  auth,
  authFailed,
  /* USERS */
  userCredentials,
  profile,
  settings,
  terms,
  register,
  profileInfo,
  accessToken,
  reissueAccessToken,
};
