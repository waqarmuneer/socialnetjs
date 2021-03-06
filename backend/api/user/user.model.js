const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: [
      {
        validator: validator.isEmail,
        message: '"{VALUE}" is not a valid email'
      },{
        validator: function(v, cb) {
          User.find({email: v}, function(err,docs){            
            cb(docs.length == 0);
          });
        },
        message: '"{VALUE}" already exists!'
      }
    ]
  },
  password: {
    type: String,
    require: true,
    minlength: [6 , "Password required atleast 6 characters"]
  },
  profile : {
    displayname : String
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var {_id, email , profile} = user.toObject();  
  return {_id, email , profile};
};

UserSchema.methods.generateAuthToken = async function () {
  try{
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();  
    var us = await user.update({     
        $push: {
          tokens: {access, token}
        }
    });      
    return token;    
  }catch(e){
    return {error: "Auth Problem - Contact Admin"};
  } 
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject({error:"Email does not exist!" , errorFields : ['email']});
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject({error:"Invalid Password!" , errorFields : ['password']});
        }
      });

    });
  });
  
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('Users', UserSchema);

module.exports = User;