const mongoose = require('mongoose');

const {Schema} = mongoose;

const adminSettingsSchema = Schema(
  {
    version: {type: String, default: '2.0.0'},
    createdAt: {type: Date, required: true, default: Date.now},
    updatedAt: {type: Date, required: true, default: Date.now},
  },
  {timestamps: true},
);

module.exports = adminSettingsSchema;
