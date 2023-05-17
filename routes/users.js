const express = require("express");
const router = express.Router();
// middleware
const middleware = require("middlewares/users");
// validation
const validatorArrays = require("validators/users/validatorArrays");
const validatorFn = require("validators/users/validatorFn");
// controllers
const adminController = require("controllers/users");
// utils
const jwt = require("utils/jwt");

// 회원 가입
router.post(
  "/register",
  validatorArrays.postRegister,
  validatorFn.returnParamVD,
  middleware.postRegister,
  adminController.postRegister
);

// 로그인
router.post(
  "/login",
  validatorArrays.postLogin,
  validatorFn.returnParamVD,
  middleware.postLogin,
  adminController.postLogin
);

// 로그아웃
router.post(
  "/logout",
  jwt.verify,
  middleware.isAdmin,
  adminController.postLogout
);

// 프로필 조회
router.get(
  "/profile",
  jwt.verify,
  middleware.isAdmin,
  adminController.getProfile
);

// 프로필 수정
router.patch(
  "/profile",
  jwt.verify,
  middleware.isAdmin,
  validatorArrays.patchProfile,
  validatorFn.returnParamVD,
  adminController.patchProfile
);

// 비밀번호 변경
router.patch(
  "/password",
  jwt.verify,
  middleware.isAdmin,
  validatorArrays.patchPassword,
  validatorFn.returnParamVD,
  middleware.patchPassword,
  adminController.patchPassword
);

// 토큰 검증 확인
router.get(
  "/token/valid",
  jwt.verify,
  middleware.isAdmin,
  adminController.getTokenValid
);

// 토큰 재발행
router.get(
  "/token/refresh",
  jwt.createAccessTokenByRefreshToken,
  middleware.isAdmin,
  adminController.getAccessTokenByExpired
);

// // 회원 탈퇴
// router.delete(
//   '/delete',
//   jwt.verify,
//   middleware.isAdmin,
//   adminController.deleteAccount,
// );

module.exports = router;
