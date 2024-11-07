const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        await User.initialize();
    } catch (error) {
        return done(error, null);
    }

    try {

        const email = profile.emails[0].value;
        const firstName = profile.name.givenName || "FirstName"; 
        const lastName = profile.name.familyName || "LastName"; 

        let user = await User.findByEmail(email);
        if (!user) {
            user = await User.create(email, firstName, lastName);
        }
        
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
