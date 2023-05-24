const express = require("express");
const router = express.Router();
const controller = require("../controllers/fabric");
// utils
const jwt = require("utils/jwt");

// 관리자 계정 생성
router.post("/enrollAdmin", controller.enrollAdmin);

// 사용자 계정 생성
router.post("/registerUser", controller.registerUser);

// 조회
router.get("/getQuery", controller.getQuery);

// 사원증 조회
router.get("/getInfo", jwt.verify, controller.getInfo);

module.exports = router;
