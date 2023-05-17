const mongoose = require('mongoose');

const {Schema} = mongoose;

const adminTermsSchema = Schema(
  {
    agreeService: {type: Boolean, required: true, default: null},
    agreePrivacy: {type: Boolean, required: true, default: null},
    createdAt: {type: Date, required: true, default: Date.now},
    updatedAt: {type: Date, required: true, default: Date.now},
  },
  {timestamps: true},
);

module.exports = adminTermsSchema;
