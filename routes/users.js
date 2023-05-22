const express = require("express");
const router = express.Router();
// middleware
const middleware = require("middlewares/users");
// controllers
const controller = require("controllers/users");
// utils
const jwt = require("utils/jwt");

// 회원가입
router.post("/register", middleware.postRegister, controller.postRegister);

// 로그인
router.post("/login", controller.postLogin);

// 로그아웃
router.post("/logout", jwt.verify, controller.postLogout);

// 프로필 조회
router.get("/profile", jwt.verify, controller.getProfile);

module.exports = router;
