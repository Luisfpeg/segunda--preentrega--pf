require('dotenv').config();

module.exports = {
  mongoURL: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRET_KEY,
};