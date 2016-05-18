const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// define user model
const userSchema = new Schema({
  // unique makes sure each email is unique for each account
  // lowercase: true save the string as lowercase
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook, encrypt password

// before saving a model, run this hook function
userSchema.pre('save', function(next) {
  // allow access to the instance of the user model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) { return next(err); }

        // overwrite plain text password with encrypted password
        user.password = hash;
        next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// create model
const ModelClass = mongoose.model('user', userSchema);


// export model
module.exports = ModelClass;