import nodemailer from 'nodemailer';
interface ISendEmailType {
  to: string;
  subject: string;
  html: string;
}
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'test@gmail.com',
    pass: 'examplepassword',
  },
});

const sendingEmail = async (emailData: ISendEmailType) => {
  try {
    const options = {
      from: 'No Reply <',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };
    const info = await transporter.sendMail(options);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    throw error;
  }
};

export default sendingEmail;
