const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {emptyElements} = require('./constants');

// 값이 있는지 확인
const isExist = (data) => {
  const emptyType = [undefined, null, NaN, false];
  const emptyString = ['undefined', 'null', 'NaN', 'false', ''];
  const emptyArray = [...emptyType, ...emptyString];

  if (typeof data === 'object') {
    return !_.isEmpty(data) ? true : false;
  } else {
    return !emptyArray.includes(data) ? true : false;
  }
};

// 현재 시간에서 초 추가
const addSecondsDate = (numOfSeconds, date = new Date()) => {
  date.setSeconds(date.getSeconds() + numOfSeconds);
  return date;
};

// 두 날짜 시간차
const diffDate = (date1 = new Date(), date2 = new Date()) => {
  return ((date2 - date1) / 1000).toFixed(0);
};

// 객체 정리
const cleanObject = (object = {}) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (!emptyElements.includes(value)) {
      if (typeof value === 'object') {
        const emptyObjects = ['{}', '[]'];
        if (!emptyObjects.includes(JSON.stringify(value))) {
          acc[key] = value;
        }
      } else if (typeof value === 'string') {
        acc[key] = value.trim();
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
};

// 객체 정리(deeper)
const deepCleanObject = (object = {}) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (!emptyElements.includes(value)) {
      if (typeof value === 'object') {
        acc[key] = deepCleanObject(value);
      } else if (typeof value === 'string') {
        acc[key] = value.trim();
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
};

// jwt 유효 여부
const jwtVerify = (token) => {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (error, decoded) => {
      return error ? false : true;
    },
  );
};

module.exports = {
  isExist,
  addSecondsDate,
  diffDate,
  cleanObject,
  deepCleanObject,
  jwtVerify,
};
