const mongoose = require('mongoose');

const {Schema} = mongoose;

const adminProfileSchema = Schema(
  {
    name: {type: String, default: null}, // 이름
    phoneNumber: {type: String, default: null}, // 전화번호
    position: {type: String, default: null}, // 직급
    age: {type: String, default: null}, // 나이
    createdAt: {type: Date, required: true, default: Date.now}, // 생성일
    updatedAt: {type: Date, required: true, default: Date.now}, // 수정일
  },
  {timestamps: true},
);

module.exports = adminProfileSchema;
