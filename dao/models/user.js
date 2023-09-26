// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiration: Date,
  documents: [
    {
      name: String,
      reference: String,
    }
  ],
  last_connection: Date,
});

module.exports = mongoose.model('User', userSchema);
