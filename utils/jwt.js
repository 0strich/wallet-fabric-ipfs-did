const util = require('util');
const jwt = require('jsonwebtoken');
const cwr = require('./createWebResp');
// errors
const {errors} = require('./errors/index');

// accessToken 발행
const createAccessToken = async (payload, expiresIn = '20m') => {
  try {
    const secretOrPrivateKey = process.env.ACCESS_TOKEN_SECRET;
    const options = {expiresIn};
    const accessToken = await util.promisify(jwt.sign)(
      payload,
      secretOrPrivateKey,
      options,
    );

    return accessToken;
  } catch (error) {
    return new Error(error);
  }
};

// refreshToken 발행
const createRefreshToken = async (payload, expiresIn = '30d') => {
  try {
    const secretOrPrivateKey = process.env.REFRESH_TOKEN_SECRET;
    const options = {expiresIn};
    const refreshToken = await util.promisify(jwt.sign)(
      payload,
      secretOrPrivateKey,
      options,
    );

    return refreshToken;
  } catch (error) {
    return new Error(error);
  }
};

// 만료된 accessToken으로 재발급
const createAccessTokenByRefreshToken = async (req, res, next) => {
  try {
    const bearerJwt = req.headers.authorization || req.headers.Authorization;

    if (!bearerJwt || !bearerJwt.startsWith('Bearer ')) {
      return cwr.errorWebResp(res, 401, errors.E90000);
    }

    const accessToken = bearerJwt.slice(7, bearerJwt.length).trimLeft();

    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      {ignoreExpiration: true},
      (decoded, error) => {
        if (error) {
          return error;
        }
        return decoded;
      },
    );
    console.log('decoded: ', decoded);

    req.decoded = decoded;
    next();
  } catch (error) {
    console.log('error: ', error);
    return cwr.errorWebResp(res, 401, errors.E90001);
  }
};

const verify = async (req, res, next) => {
  try {
    const bearerJwt = req.headers.authorization || req.headers.Authorization;

    if (!bearerJwt || !bearerJwt.startsWith('Bearer ')) {
      return cwr.errorWebResp(res, 401, errors.E90000);
    }

    const accessToken = bearerJwt.slice(7, bearerJwt.length).trimLeft();

    const decoded = await util.promisify(jwt.verify)(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    req.decoded = decoded;
    next();
  } catch (error) {
    return cwr.errorWebResp(res, 401, errors.E90001);
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createAccessTokenByRefreshToken,
  verify,
};
