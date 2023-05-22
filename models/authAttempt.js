const mongoose = require("mongoose");

const { Schema } = mongoose;

const authAttemptSchema = Schema(
  {
    type: { type: String, default: "saltmine" },
    userId: { type: Schema.Types.ObjectId, ref: "users", default: null },
    failCount: { type: Number, default: 0 },
    lockCount: { type: Number, default: 5 },
    isLock: { type: Boolean, default: false },
    isLogin: { type: Boolean, default: false },
    triedAt: { type: Date, default: Date.now },
    releaseAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth_attempts", authAttemptSchema);
