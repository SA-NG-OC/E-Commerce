import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true nếu 465, false nếu 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendMail({ to, subject, html }: { to: string, subject: string, html: string }) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html
    });
}
