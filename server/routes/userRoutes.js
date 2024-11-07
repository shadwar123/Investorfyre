const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

router.get('/get-profile', async (req, res) => {
    try {
      const email = req.session.user?.email; 
      // console.log("User email from session:",req);
  
      if (!email) return res.status(401).json({ error: 'Unauthorized' });
  
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Route to update user profile
  router.post('/profile', async (req, res) => {
    const { first_name, last_name, country, company_website, social1, social2, profile_picture } = req.body;
    let profilePictureUrl = '';
  
    try {
      if (profile_picture) {
        // console.log('profile pic',profile_picture)
        const result = await cloudinary.uploader.upload(profile_picture, {
          folder: 'user_profiles',
        });
        profilePictureUrl = result.secure_url;
        // console.log('profile url',profilePictureUrl)
      }
      const email = req.session.user?.email;
      if (!email) return res.status(401).json({ error: 'Unauthorized' });
      // console.log('profile url 2',profilePictureUrl)
      const updatedUser = await User.updateProfile(email, {
        first_name,
        last_name,
        country,
        company_website,
        social1,
        social2,
        profile_picture: profilePictureUrl,
      });
      // console.log('profile url 3',profilePictureUrl)
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

module.exports = router;
