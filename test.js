import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yellownode.eduardo@gmail.com",
        pass: "bovo ydmo ycqn ltez",
    },
});
const mailOptions = {
    from: "yellownode.eduardo@gmail.com",
    to: "yellownode.eduardo@gmail.com",
    subject: "Test",
    text: "This is a test.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Email sent:", info.response);
    }
});