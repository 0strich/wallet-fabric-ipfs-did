const mongoose = require('mongoose');

const {Schema} = mongoose;

const authsSchema = Schema(
  {
    user: {type: Schema.Types.ObjectId, require: true, ref: 'users'}, // 사용자 계정 ID 참조
    admin: {type: Schema.Types.ObjectId, require: true, ref: 'admins'}, // 관리자 계정 ID 참조
    vendor: {type: Schema.Types.ObjectId, require: true, ref: 'vendors'}, // 제휴사 계정 ID 참조
    type: {type: String, default: 'saltmine'}, // 인증 유형
    refreshToken: {type: String, default: null}, // refreshToken
    failCount: {type: Number, default: 0}, // 로그인 실패 횟수
    limitCount: {type: Number, default: 5}, // 제한 횟수
    isLock: {type: Boolean, default: false}, // 잠김 여부
    isLogin: {type: Boolean, default: false}, // 로그인 여부
    authorized: {type: Boolean, default: false}, // 승인 여부
    platform: {type: String, default: ''}, // 접속 기기 플랫폼
    authTriedAt: {type: Date, default: Date.now}, // 시도 날짜
    authReleaseAt: {type: Date, default: Date.now}, // 해재 날짜
    createdAt: {type: Date, default: Date.now}, // 생성일
    updatedAt: {type: Date, default: Date.now}, // 수정일
  },
  {timestamps: true},
);

module.exports = mongoose.model('auths', authsSchema);
