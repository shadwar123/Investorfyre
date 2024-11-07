// backend/routes/authRoutes.js
const express = require('express');
const { login, signup ,verifyEmail} = require('../controllers/authController');
const passport = require('../passport');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/verify', verifyEmail);



// Route to start Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = { email: req.user.email };
        res.redirect('http://localhost:3000/profile');
    }
);

module.exports = router;
