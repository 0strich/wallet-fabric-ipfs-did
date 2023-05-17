const {cleanObject} = require('./function');

/* AUTH */
// 인증 상태 초기화
const authReset = (object) =>
  cleanObject({
    failCount: 0,
    isLock: false,
  });

const auth = (object) =>
  cleanObject({
    type: object?.authType,
    authorized: object?.authorized,
  });

// 인증 실패
const authFailed = (object) =>
  cleanObject({
    failCount: object?.failCount,
    isLock: object?.isLock,
    triedAt: Date.now(),
  });

/* ADMIN */
// [관리자] 인증 정보(로그인)
const adminAuthValues = (object) =>
  cleanObject({
    email: object?.email,
    password: object?.password,
    salt: object?.salt,
  });

// [관리자] 프로필
const adminProfile = (object) =>
  cleanObject({
    name: object?.name,
    phoneNumber: object?.phoneNumber,
    position: object?.position,
    age: object?.age,
  });

// [관리자] 설정
const adminSettings = (object) =>
  cleanObject({
    version: object?.version,
  });

// [관리자] 약관
const adminTerms = (object) =>
  cleanObject({
    agreeService: object?.agreeService,
    agreePrivacy: object?.agreePrivacy,
  });

// [관리자] 회원가입 정보
const adminRegister = (object) =>
  cleanObject({
    authValues: {...adminAuthValues(object)},
    profile: {...adminProfile(object)},
    settings: {...adminSettings(object)},
    terms: {...adminTerms(object)},
  });

// [관리자] 프로필 정보(노출)
const adminProfileInfo = (object) => ({
  email: object?.authValues?.email,
  name: object?.profile?.name,
  phoneNumber: object?.profile?.phoneNumber,
  position: object?.profile?.position,
  age: object?.profile?.age,
});

// [관리자] jwt access token
const adminAccessToken = (object1, object2) =>
  cleanObject({
    id: object1?._id,
    authId: object2?._id,
    type: object1?.type,
  });

// [관리자] accessToken 재발행
const adminReissueAccessToken = (object) =>
  cleanObject({
    id: object?.id,
    authId: object?.authId,
    type: object?.type,
  });

// [관리자] 공지사항
const notice = (object) =>
  cleanObject({
    tag: object?.tag,
    category: object?.category,
    title: object?.title,
    content: object?.content,
    image: '',
  });

/* VENDOR */
// [제휴사] 인증 정보(로그인)
const vendorAuthValues = (object) =>
  cleanObject({
    email: object?.email,
    password: object?.password,
    salt: object?.salt,
  });

// [제휴사] 프로필
const vendorProfile = (object) =>
  cleanObject({
    companyName: object?.companyName,
    companyRegistrationNumber: object?.companyRegistrationNumber,
    corporateRegistrationNumber: object?.corporateRegistrationNumber,
    address: object?.address,
    companyPhoneNumber: object?.companyPhoneNumber,
    industryName: object?.industryName,
    fax: object?.fax,
    contactName: object?.contactName,
    contactPosition: object?.contactPosition,
    contactPhoneNumber: object?.contactPhoneNumber,
    contactEmail: object?.contactEmail,
    point: object?.point,
  });

// [제휴사] 설정
const vendorSettings = (object) =>
  cleanObject({
    version: object?.version,
    clientId: object?.clientId,
    apiKey: object?.apiKey,
    apiSecret: object?.apiSecret,
  });

// [제휴사] 약관
const vendorTerms = (object) =>
  cleanObject({
    agreeService: object?.agreeService,
    agreePrivacy: object?.agreePrivacy,
  });

// [제휴사] 회원가입 정보
const vendorRegister = (object) =>
  cleanObject({
    authValues: {...vendorAuthValues(object)},
    profile: {...vendorProfile(object)},
    settings: {...vendorSettings(object)},
    terms: {...vendorTerms(object)},
  });

// [제휴사] 프로필 정보(노출)
const vendorProfileInfo = (object) => ({
  email: object?.authValues?.email,
  companyName: object?.profile?.companyName,
  companyRegistrationNumber: object?.profile?.companyRegistrationNumber,
  corporateRegistrationNumber: object?.profile?.corporateRegistrationNumber,
  address: object?.profile?.address,
  companyPhoneNumber: object?.profile?.companyPhoneNumber,
  industryName: object?.profile?.industryName,
  fax: object?.profile?.fax,
  contactName: object?.profile?.contactName,
  contactPosition: object?.profile?.contactPosition,
  contactPhoneNumber: object?.profile?.contactPhoneNumber,
  contactEmail: object?.profile?.contactEmail,
  point: object?.profile?.point,
});

// [제휴사] jwt access token
const vendorAccessToken = (object1, object2) =>
  cleanObject({
    id: object1?._id,
    authId: object2?._id,
    type: object1?.type,
  });

/* USER */
// [사용자] 프로필
const userProfile = (object) =>
  cleanObject({
    name: object?.name,
    phoneNumber: object?.phoneNumber,
    address: object?.address,
    age: object?.age,
    nickname: object?.nickname,
    point: object?.point,
    profileImage: object?.profileImage,
  });

// [사용자] 설정
const userSettings = (object) =>
  cleanObject({
    version: object?.version,
  });

// [사용자] 약관
const userTerms = (object) =>
  cleanObject({
    agreeService: object?.agreeService,
    agreePrivacy: object?.agreePrivacy,
  });

// [사용자] 회원가입 정보
const userRegister = (object) =>
  cleanObject({
    authValues: {...userAuthValues(object)},
    profile: {...userProfile(object)},
    settings: {...userSettings(object)},
    terms: {...userTerms(object)},
  });

// [사용자] 프로필 정보(노출)
const userProfileInfo = (object) => ({
  email: object?.authValues?.email,
  name: object?.profile?.name,
  phoneNumber: object?.profile?.phoneNumber,
  address: object?.profile?.address,
  age: object?.profile?.age,
  nickname: object?.profile?.nickname,
  point: object?.profile?.point,
  profileImage: object?.profile?.profileImage,
});

// [사용자] jwt access token
const userAccessToken = (object1, object2) =>
  cleanObject({
    id: object1?._id,
    authId: object2?._id,
    type: object1?.type,
  });

const approval = (object) =>
  cleanObject({
    name: object?.name,
    birthday: object?.birthday,
    carrier: object?.carrier,
    certified: object?.certified,
    foreigner: object?.foreigner,
    gender: object?.gender,
    phone: object?.phone,
  });

const smtiEvent = (object) =>
  cleanObject({
    name: object?.name,
    email: object?.email,
    phoneNumber: object?.phoneNumber,
    address: object?.address,
    gender: object?.gender,
    age: object?.age,
    agreePrivacy: object?.agreePrivacy,
    smtiRecord: object?.smtiRecord,
  });

/* AWS */
const s3Object = (object) => {
  const {_id, protocol, bucket, host, key} = object;
  return {
    objectId: _id,
    objectUrl: `${protocol}//${bucket}.${host}/${key}`,
  };
};

module.exports = {
  /* AUTH */
  authReset,
  auth,
  authFailed,
  /* ADMIN */
  adminAuthValues,
  adminProfile,
  adminSettings,
  adminTerms,
  adminRegister,
  adminProfileInfo,
  adminAccessToken,
  adminReissueAccessToken,
  notice,
  /* VENDOR */
  vendorAuthValues,
  vendorProfile,
  vendorSettings,
  vendorTerms,
  vendorRegister,
  vendorProfileInfo,
  vendorAccessToken,
  /* USER */
  userProfile,
  userSettings,
  userTerms,
  userRegister,
  userProfileInfo,
  userAccessToken,
  approval,
  smtiEvent,
  /* AWS */
  s3Object,
};
