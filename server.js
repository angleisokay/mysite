import express from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

app.use(express.json());

// Load info.json properly
let fileData = JSON.parse(fs.readFileSync('./info.json', 'utf8'));
let reqid = fileData.reqnum;
let reqs = fileData.reqs;

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yellownode.eduardo@gmail.com",
        pass: "bovo ydmo ycqn ltez", // ⚠️ Consider using environment variables for security
    },
});

// Shared state for tracking signals
let signals = {};

// GET API - Waits until corresponding POST API is called
app.get('/', async (req, res) => {
    reqid += 1;
    signals[reqid] = false; // Track request status

    let textBody = JSON.stringify({ status: "success", reqid: reqid });
    
    let mailOptions = {
        from: "yellownode.eduardo@gmail.com",
        to: "yellownode.eduardo@gmail.com",
        subject: "YELLOWNODE:yellownode-example/",
        text: textBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });

    // Wait for signal from /returnmain
    const waitForSignal = async () => {
        while (!signals[reqid]) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
        }
        return reqs[reqid] || { status: "error", message: "Request ID not found" };
    };

    res.json(await waitForSignal());
});

// POST API - Sends signal to waiting GET request
app.post('/returnmain', (req, res) => {
    const { requestid, main } = req.body;
    if (!signals[requestid]) {
        return res.status(400).json({ status: "error", message: "Invalid request ID" });
    }
    reqs[requestid] = main;
    signals[requestid] = true; // Unblock GET request
    res.json({ status: "success", requestid });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
