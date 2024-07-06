const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const { userModel, validateUser } = require('./model/model');
const nodemailer = require('nodemailer');

dotenv.config();
require('./connec'); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for other ports
    auth: {
        user: process.env.USER,
        pass: process.env.USER_PASS,
    },
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/appointment/'));

app.use(express.urlencoded({ extended: true }));

app.post('/view/appointment/:name', async (req, res) => {
    try {
        const { name, email_address, phone, category, date, message } = req.body;

        const { error } = validateUser({ name, email_address, phone, category, date, message });
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const newUser = new userModel({ name, email_address, phone, category, date, message });
        await newUser.save();

        console.log('Appointment Details:', { name, email_address, phone, category, date, message });

        
        res.render('appointment', { name });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('An unexpected error occurred');
    }
});


app.post('/subscribe', async (req, res) => {
    const { subs_email } = req.body;
    console.log('Subscribed email:', subs_email);

    try {
        
        const info = await transporter.sendMail({
            from: {
                name: "onclick",
                address: process.env.USER,
            },
            to: subs_email,
            subject: "Subscription Successful - Welcome to OnClick Hair Salon!",
            text: `Thank you for subscribing to OnClick Barber Slot Booking! We're excited to have you join us. Get ready to experience hassle-free booking and enjoy our exclusive services.\n\nStay tuned for updates, promotions, and exciting offers tailored just for you.\n\nBest regards,\nThe OnClick Team`,
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #ffffff;
                            color: #000000;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #000000;
                            border-radius: 5px;
                        }
                        .header {
                            background-color: #000000;
                            color: #ffffff;
                            padding: 10px;
                            text-align: center;
                        }
                        .content {
                            padding: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to OnClick Barber Slot Booking!</h1>
                        </div>
                        <div class="content">
                            <p>Thank you for subscribing to OnClick Barber Slot Booking! We're excited to have you join us.</p>
                            <p>Get ready to experience hassle-free booking and enjoy our exclusive services.</p>
                            <p>Stay tuned for updates, promotions, and exciting offers tailored just for you.</p>
                            <p>Best regards,<br/>The OnClick Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });
        

        console.log('Message sent: %s', info.messageId);
        res.sendFile(path.join(__dirname, 'views/subscribe/subs.html')); 
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        res.sendFile(path.join(__dirname, 'views/subscribe/fail.html')); 
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
