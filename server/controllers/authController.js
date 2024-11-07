
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
}, (error) => {
    if (error) {
        console.error('Error creating transporter:', error);
    }
});

const sendVerificationEmail = (email, token) => {
    const verificationLink = `http://localhost:3000/verify?token=${token}`;
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Click on this link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return;
        }
        console.log('Email sent:', info.response);
    });
};

exports.verifyEmail = async (req, res) => {

    const { token } = req.query;
    console.log("In varifiaction")

    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        // console.log('email')
        
        const user = await User.findByEmail(email);
        if (user) {
            // console.log('email', user)
            user.isverified = true; 
            await user.save; 
            return res.json({ message: 'Email verified successfully!' });
        } else {
            return res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        console.error('Verification error:', error); 
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};


exports.login = async (req, res) => {
    const { email } = req.body;
    console.log('Login email:', email);
  
    const user = await User.findByEmail(email);
    if (user) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10h' });
      sendVerificationEmail(email, token);
  
      if (!req.session.user) {
        req.session.user = {}; 
        console.log('Session initialized:', req.session.user.email);
      }
  
      req.session.user.email = email; 
      console.log('Session after setting email:', req.session.user.email);
  
      return res.json({ message: 'Verification link sent to your email!' });
    } else {
      return res.status(404).json({ message: 'Email not found!' });
    }
  };





exports.signup = async (req, res) => {
    console.log('user',req.body)
    const { email , first_name , last_name } = req.body;
    console.log('user',req.body)
    try {
        await User.initialize();
    } catch (error) {
        return res.status(500).json({ message: 'Database initialization error' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists!' });
    }
    try {
        const newUser = await User.create(email, first_name, last_name);
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '10h' });
        sendVerificationEmail(newUser.email, token);
        if (!req.session.user) {
            req.session.user = {}; 
            console.log('Session initialized:', req.session.user);
          }
      
          req.session.user.email = email; 
          console.log('Session after setting email:', req.session.user);
        
        res.json({ message: 'Verification link sent to your email!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};
