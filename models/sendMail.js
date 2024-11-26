const nodemailer = require('nodemailer');
const { createHmac } = require('crypto');
exports.sendVerificationToken = async (email, verificationToken) => {
          const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                              user: process.env.NODE_MAILER_USER,
                              pass: process.env.NODE_MAILER_PASS,
                    },
          });
          return await transporter.sendMail({
                    from: process.env.NODE_MAILER_USER,
                    to: email,
                    subject: 'Verification Token',
                    html: `<p>Your verification token is <b>${verificationToken}</b></p>`,
          });
}

exports.createHmacProcess = async (value, key) => {
          console.log(value, key);
          return createHmac('sha256', key).update(value).digest('hex');
}