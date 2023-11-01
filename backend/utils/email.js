import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = `Nikhil Satyam <${process.env.GMAIL_FROM}>`;
	}

	newTransport() {
		//Real time email sending service from gmail
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: 'satyamnikhil1523@gmail.com',
        pass: 'qdvcvtmrgbnpkowm',
			},
		});
		transporter.verify((err) => {
			if (err) console.error(err);
		});
		return transporter;
	}

	//* SENDS the actual mail
	async send(template, subject) {
		// 1) RENDER HTML based on a pug TEMPLATE
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				firstName: this.firstName,
				url: this.url,
				subject,
			}
		);
		const text = convert(html, {
			wordwrap: 130,
		});
		// 2) DEFINE email OPTIONS
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text,
		};

		// 3) CREATE TRANSPORT and SEND mail
		try {
			await this.newTransport().sendMail(mailOptions);
		} catch (err) {
			console.log(err);
		}
	}

	async sendWelcome() {
		await this.send("welcome", "Welcome to the Natours!");
	}

	async sendPasswordReset() {
		await this.send(
			"passwordReset",
			"Your password reset token(valid for only 10 mins)"
		);
	}
}

export default Email;
