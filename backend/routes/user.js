const express = require('express');
const bcrypt = require('bcrypt');

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

module.exports = router;
