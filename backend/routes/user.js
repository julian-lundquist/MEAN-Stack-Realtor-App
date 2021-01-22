const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

//create new user
router.post('/create', (req,res,next) => {
  bcrypt.hash(req.body.password, 10).then(passwordHash => {
    const user = User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNum: req.body.phoneNum,
      email: req.body.email,
      password: passwordHash
    });

    user.save().then(result => {
      res.status(201).json(result);
    }).catch(err => {
      res.status(200).json(err);
    });
  });
});

//Authenticate User via login
router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.find({email: req.body.email}).then(userData => {
    if (!userData) {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    } else {
      fetchedUser = userData[0];
      return bcrypt.compare(req.body.password, fetchedUser.password);
    }
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    }
    const token = jwt.sign(
      {userId: fetchedUser._id, email: fetchedUser.email},
      'secret_realtor_log_123_cba',
      {expiresIn: '1h'}
      );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  }).catch(err => {
    return res.status(401).json(err);
  });
});

module.exports = router;
