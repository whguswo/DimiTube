import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (email: string, hash: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASS,
        },
    });

    const mailOptions: nodemailer.SendMailOptions = {
        from: `DimiTube <${process.env.MAILER_ID}>`,
        to: email,
        subject: 'DimiTube 이메일 인증 ( DimiTube Email Verify )',
        html: `<h1>계정의 이메일을 인증하려면 밑에있는 링크를 클릭해주세요.</h1><br><a href="http://localhost:3000/verify?hash=${hash}">이메일 인증하기!</a>`
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`Sucessed to send mail to ${email}`)
        }
    })
}

export { sendEmail }