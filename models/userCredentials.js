const mongoose = require("mongoose");

const { Schema } = mongoose;

const userCredentialsSchema = Schema(
  {
    name: { type: String, unique: true, default: "" }, // 이메일
    email: { type: String, unique: true, default: "" }, // 이메일
    password: { type: String, required: true, trim: true }, // 비밀번호
    salt: { type: String, required: true }, // 솔트
    createdAt: { type: Date, default: Date.now }, // 생성일
    updatedAt: { type: Date, default: Date.now }, // 수정일
  },
  { timestamps: true }
);

module.exports = mongoose.model("user_credentials", userCredentialsSchema);
