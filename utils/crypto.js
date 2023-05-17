const Crypto = require('crypto');
const CryptoJS = require('crypto-js');

// 평문 AES 암호화
const plainTextAESEncryption = (plainText, secret) => {
  return CryptoJS.AES.encrypt(plainText, secret).toString();
};

// 평문 AES 복호화
const plainTextAESDecryption = (plainText, secret) => {
  const bytes = CryptoJS.AES.decrypt(plainText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Json Object 자료형 암호화
// 객체 예시 const object = [{id: 1}, {id: 2}]
const objectAESEncryption = (object, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(object), secret).toString();
};

// Json Object 자료형 복호화
const objectAESDecryption = (object, secret) => {
  const bytes = CryptoJS.AES.decrypt(object, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// salt 생성
const saltGenerator = () => {
  return Math.round(new Date().valueOf() * Math.random()).toString();
};

const toSha512Hash = async (plaintext, salt) =>
  await Crypto.createHash('sha512')
    .update(plaintext + salt)
    .digest('hex');

const createHashString = async (length) => {
  let result = '';
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// 비밀번호 검증
const verify = async (cmpPassword, password, salt) => {
  const cmpHash = await toSha512Hash(cmpPassword, salt);
  return password === cmpHash ? true : false;
};

module.exports = {
  plainTextAESEncryption,
  plainTextAESDecryption,
  objectAESEncryption,
  objectAESDecryption,
  saltGenerator,
  toSha512Hash,
  createHashString,
  verify,
};
