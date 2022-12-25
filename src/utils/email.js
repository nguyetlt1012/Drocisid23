const nodemailer = require('nodemailer');

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.url = url;
        this.from = `DISCORD FAKE`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(subject) {

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: 'Click link to reset password: '+ this.url,
        };

        
        await this.newTransport().sendMail(mailOptions);
    }

    async sendPasswordReset() {
        await this.send('Your password reset token (valid for 10 minutes)');
    }
}
module.exports = Email;
