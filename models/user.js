var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Store = require('./thingsMod');

var User = new mongoose.Schema({
  local : {
    email    : String,
    password : String
  },
  items : [Store.schema] ,///looks at databass
  bank : Number
});

User.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
//checks if the password you entered is a valid password
User.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
