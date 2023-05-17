const mongoose = require('mongoose');

const {Schema} = mongoose;

const tokenSchema = Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'user', default: null},
    fcmToken: {type: String, default: ''},
    createdAt: {type: Date, required: true, default: Date.now},
    updatedAt: {type: Date, required: true, default: Date.now},
  },
  {timestamps: true},
);

module.exports = mongoose.model('token', tokenSchema);
