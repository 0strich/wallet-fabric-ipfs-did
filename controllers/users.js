// models
const AuthAttempt = require("models/authAttempt");
const UserCredentials = require("models/userCredentials");
// services
const service = require("services/index");
// utils
const jwt = require("utils/jwt");
const cwr = require("utils/createWebResp");
const payload = require("utils/payload");
// errors
const { errors } = require("utils/errors/index");

// 회원가입
const postRegister = async (req, res) => {
  try {
    const body = req.body;
    const userPayload = payload.register(body);
    const docs = await service.create(UserCredentials, userPayload);

    // authAttempt 생성
    await service.create(AuthAttempt, { userId: docs?._id });

    // accessToken 생성
    const jwtPayload = payload.accessToken(docs);
    const accessToken = await jwt.createAccessToken(jwtPayload);

    return cwr.createWebResp(res, 200, { accessToken });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00009, error.message);
  }
};

// 로그인
const postLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const userDocs = await service.readByEmail(UserCredentials, email);

    // accessToken 생성
    const jwtPayload = payload.accessToken(userDocs);
    const accessToken = await jwt.createAccessToken(jwtPayload);

    return cwr.createWebResp(res, 200, { accessToken });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00019, error.message);
  }
};

// 로그아웃
const postLogout = async (req, res) => {
  try {
    const { authId } = req.decoded;

    // db refreshToken 삭제
    await service.updateById(AuthAttempt, authId, { refreshToken: null });

    return cwr.createWebResp(res, 200, { success: true });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00029, error.message);
  }
};

// 프로필 조회
const getProfile = async (req, res) => {
  try {
    const { id } = req.decoded;
    const docs = await service.readById(UserCredentials, id);
    const profileInfo = payload.profileInfo(docs);

    return cwr.createWebResp(res, 200, profileInfo);
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00039, error.message);
  }
};

// 만료된 accessToken으로 토큰 재발행
const getAccessTokenByExpired = async (req, res) => {
  try {
    const decoded = req.decoded;

    // accessToken 생성
    const jwtPayload = payload.adminReissueAccessToken(decoded);
    const accessToken = await jwt.createAccessToken(jwtPayload);

    return cwr.createWebResp(res, 200, { accessToken });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00019, error.message);
  }
};

module.exports = {
  postRegister,
  postLogin,
  postLogout,
  getProfile,
  getAccessTokenByExpired,
};
