const axios = require("axios");
const iamportConfig = require("config/iamportConfig");
const headerConfig = require("config/headerConfig");
// utils
const payload = require("utils/payload");

// 권한이 있는 사용자만 호출 or 서버 사이드에서 호출
const getAccessaccessToken = async () => {
  try {
    const url = iamportConfig.getToken;
    const data = {
      imp_key: process.env.IMP_KEY,
      imp_secret: process.env.IMP_SECRET,
    };

    const response = await axios.post(url, data);

    const { access_token } = response.data.response;
    return access_token;
  } catch (error) {
    console.log("imp/getAccessToken Error => ", error);
  }
};

// 인증 내역 호출
const getCertification = async (impUid) => {
  try {
    // get iamport accessToken
    const accessaccessToken = await getAccessToken();

    const url = `${iamportConfig.getCertification}/${impUid}`;
    const config = headerConfig.impAuthHeader(accessToken);
    const response = await axios.get(url, config);

    return payload.certification(response.data.response);
  } catch (error) {
    console.log("imp/getAccessToken Error => ", error);
  }
};

module.exports = {
  getAccessToken,
  getCertification,
};
