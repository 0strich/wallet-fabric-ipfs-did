const express = require("express");
const router = express.Router();
const controller = require("../controllers/fabric");

// 관리자 계정 생성
router.get("/enrollAdmin", controller.enrollAdmin);

// 사용자 계정 생성
router.get("/registerUser", controller.registerUser);

// 조회
router.get("/getQuery", controller.getQuery);

module.exports = router;
