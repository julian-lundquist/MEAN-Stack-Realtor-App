const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/realtor?retryWrites=true').then(() => {
  console.log('Connected to Mongo Database');
}).catch(() => {
  console.log('There was an error connecting to the Mongo Database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
