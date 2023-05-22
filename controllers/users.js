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
    const authAttemptDocs = await service.readOne(AuthAttempt, {
      userId: userDocs?._id,
    });

    // accessToken 생성
    const jwtPayload = payload.accessToken(authAttemptDocs);
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
    const profileInfo = payload.adminProfileInfo(docs);

    return cwr.createWebResp(res, 200, profileInfo);
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00039, error.message);
  }
};

// 프로필 수정
const patchProfile = async (req, res) => {
  try {
    const { id } = req.decoded;
    const body = req.body;

    // 프로필 수정
    const profilePayload = payload.adminProfile(body);
    const profileUpdate = { profile: profilePayload };
    const docs = await service.updateById(UserCredentials, id, profileUpdate);

    // accessToken 응답
    const jwtPayload = payload.adminAccessToken(docs);
    const accessToken = await jwt.createAccessToken(jwtPayload);

    return cwr.createWebResp(res, 200, { accessToken });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00049, error.message);
  }
};

// 비밀번호 변경
const patchPassword = async (req, res) => {
  try {
    const { id } = req.decoded;
    const body = req.body;

    // docs 조회
    const docs = await service.readById(UserCredentials, id);

    const authValuesUpdate = payload.adminAuthValues(body);
    Object.assign(docs.authValues, authValuesUpdate);
    await service.updateById(UserCredentials, id, docs);

    return cwr.createWebResp(res, 200, { success: "비밀번호 변경 성공" });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00059, error.message);
  }
};

// 화원 탈퇴(추후 수정)
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.decoded;

    return cwr.createWebResp(res, 200, { delete: "success" });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00069, error.message);
  }
};

// 토큰 검증
const getTokenValid = async (req, res) => {
  try {
    return cwr.createWebResp(res, 200, { success: true });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00019, error.message);
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
  patchProfile,
  patchPassword,
  deleteAccount,
  getTokenValid,
  getAccessTokenByExpired,
};
