import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trillionwon@dimigo.hs.kr',
    pass: process.env.GOOGLE_APP_PASSWORD
  }
});

async function sendVerificationEmail(email, token) {
  const mailOptions = {
    from: 'Step Up <trillionwon@dimigo.hs.kr>',
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: https://stepup.trillion-won.com/verify?token=${token}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("sendMail error!");
      console.log(error);
      console.log(info);
      throw error;
    }
  });
}

export default sendVerificationEmail;
