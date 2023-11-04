import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = `Nikhil Satyam <${process.env.GMAIL_FROM}>`;
	}

	newTransport() {
		// Real time email sending service from gmail
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: 'satyamnikhil1523@gmail.com',
        pass: 'qdvcvtmrgbnpkowm',
			},
		});
		return transporter;
	}

	async send(template, subject) {
		try {
			console.log(__dirname);
			const html = pug.renderFile(
				`${__dirname}/../view/emails/${template}.pug`,
				{
					firstName: this.firstName,
					url: this.url,
					subject,
				}
			);
			const text = convert(html, {
				wordwrap: 130,
			});

			const mailOptions = {
				from: this.from,
				to: this.to,
				subject,
				html,
				text,
			};

			await this.newTransport().sendMail(mailOptions);
		} catch (error) {
			// Handle email sending error
			console.error("Error sending email:", error);
			throw new Error("Error sending email");
		}
	}

	async sendWelcome() {
		await this.send("welcome", "Welcome to the AskCode!");
	}

	async sendPasswordReset() {
		await this.send(
			"passwordReset",
			"Your password reset token (valid for only 10 mins)"
		);
	}
}

export default Email;
