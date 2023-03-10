const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToekn, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({googleId: profile.id});
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  //   passport.serializeUser(async function (user) {
  //     return user.id;
  //   });
  //   passport.deserializeUser(function (id, done) {
  //     User.findById(id, function (err, user) {
  //       done(err, done);
  //     });
  //   });
  //   passport.deserializeUser(async function (id) {
  //     try {
  //       const user = await User.findById(id);
  //       return user;
  //     } catch (err) {
  //       console.err(err);
  //     }
  //   });
  //   passport.deserializeUser(function (id) {
  //     return User.findById(id)
  //       .then(function (user) {
  //         return user;
  //       })
  //       .catch(function (err) {
  //         throw err;
  //       });
  //   });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
};
