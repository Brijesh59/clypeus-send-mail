
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors')

const app = express();
const log = console.log;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const PORT = process.env.PORT || 8000;

let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 587,
    auth: {
      user: process.env.MAILUSER , 
      pass: process.env.MAILUSERPASS
    }
});

app.post('/clypeusmail', (req, res) => {
    const { senderName, senderEmail, message } = req.body;
    log('Recieved User Data: ', req.body);

    const subject = senderName ? 'Clypeus AI - Contact Us Details' :  'Clypeus AI - Newsletter Form'
    const messageBody = senderName ? `Name: ${senderName}\n Email: ${senderEmail}\n Message: ${message}` : `Email: ${senderEmail}\n`

    const mailOptions = {
        from: '"Brijesh Kumar Kushwaha" <brijesh@clypeus.ai>',
        to: "admin@clypeus.ai",
        subject,
        text: messageBody
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            log('Error in sending mail: ', err.message)
            return res.status(500).json({
                status: 'fail',
                message: 'Email was not sent',
                error: err.message
            })
        }
        log('Email sent successfully.')
        return res.status(200).json({
            status: 'success',
            message: 'Email sent successfully'
        })
    })
});

app.listen(PORT, () => log('Server is starting on PORT, ', PORT));
