// allow access to users in database
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

// assign token to user
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user already authorized, but needs token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide an email and password' });
  }

  // See if a user with the given name exists
  User.findOne({ email: email }, function(err, existingUser) {
    // check for error
    if(err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'This email is already in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    // save new user to database
    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating that the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}
