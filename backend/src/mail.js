const nodemailer = require('nodemailer');
require('dotenv').config();

const emailOptions = {
  from: process.env.ADMIN_EMAIL,
  to: '',
  subject: '임시 비밀번호 안내 입니다.',
  html: '',
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

module.exports = { emailOptions, transporter };
