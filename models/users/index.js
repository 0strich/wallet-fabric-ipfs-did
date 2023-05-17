const mongoose = require('mongoose');
// 인증
const AdminAuthValues = require('./adminAuthValues');
// 프로필
const AdminProfile = require('./adminProfile');
// 설정
const AdminSettings = require('./adminSettings');
// 이용 약관
const AdminTerms = require('./adminTerms');

const {Schema} = mongoose;

const adminsSchema = Schema(
  {
    type: {type: String, default: 'admin'},
    isDormant: {type: Boolean, default: false},
    authValues: {type: AdminAuthValues, default: null},
    profile: {type: AdminProfile, default: null},
    settings: {type: AdminSettings, default: null},
    terms: {type: AdminTerms, default: null},
    createdAt: {type: Date, required: true, default: Date.now},
    updatedAt: {type: Date, required: true, default: Date.now},
  },
  {timestamps: true},
);

module.exports = mongoose.model('admins', adminsSchema);
