const { check } = require("express-validator");

// exists 존재하면 참
// isEmpty 비어있어야 참

/* USER */
// [관리자] 회원가입
const postRegister = [
  check("authType", "인증유형을 확인해 주세요.")
    .isString()
    .matches(/\bsaltmine\b|\bkakao\b|\bnaver\b|\bfacebook\b/),
  check("email", "이메일을 확인해 주세요.")
    .normalizeEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  check("password", "비밀번호를 확인해 주세요.")
    .isString()
    .isLength({ min: 6, max: 15 })
    .exists(),
  check("passwordConfirm", "비밀번호 재확인을 확인해 주세요.")
    .isString()
    .isLength({ min: 6, max: 15 })
    .exists(),
  check("name", "이름을 확인해 주세요.").isString().exists(),
  check("agreeService", "서비스 동의를 확인해 주세요.").isBoolean().exists(),
  check("agreePrivacy", "정책 동의를 확인해 주세요.").isBoolean().exists(),
];

// [관리자] 로그인
const postLogin = [
  check("email", "이메일을 확인해 주세요.")
    .normalizeEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  check("password", "비밀번호를 확인해 주세요.")
    .isString()
    .isLength({ min: 6, max: 15 }),
];

// [관리자] 프로필 수정
const patchProfile = [
  // check('name', '이름을 확인해 주세요.').isString(),
  // check('phoneNumber', '전화번호를 확인해 주세요.').isString(),
  // check('position', '직급을 등록번호를 확인해 주세요.').isString(),
  // check('age', '나이를 등록번호를 확인해 주세요.').isString(),
];

// [관리자] 비밀번호 변경
const patchPassword = [
  check("oldPassword", "이전 비밀번호를 확인해 주세요.")
    .isString()
    .isLength({ min: 6, max: 15 }),
  check("newPassword", "새로운 비밀번호를 확인해 주세요.")
    .isString()
    .isLength({ min: 6, max: 15 }),
  check("confirmNewPassword", "새로운 비밀번호 확인을 확인해 주세요.")
    .isString()
    .isLength({ min: 6, max: 15 })
    .exists(),
];

/* NOTICE */
// [관리자] 공지 등록
const postNotice = [
  check("tag", "제목을 확인해 주세요.").isString().exists(),
  check("category", "제목을 확인해 주세요.").isString().exists(),
  check("title", "제목을 확인해 주세요.").isString().exists(),
  check("content", "내용을 확인해 주세요.").isString().exists(),
  check("image", "이미지를 확인해 주세요.").isString(),
];

// [관리자] 공지 수정
const patchNotice = [
  check("tag", "제목을 확인해 주세요.").isString().exists(),
  check("category", "제목을 확인해 주세요.").isString().exists(),
  check("title", "제목을 확인해 주세요.").isString().exists(),
  check("content", "내용을 확인해 주세요.").isString().exists(),
  check("image", "이미지를 확인해 주세요.").isString(),
];

module.exports = {
  // admin
  postRegister,
  postLogin,
  patchProfile,
  patchPassword,
  // notice
  postNotice,
  patchNotice,
};
