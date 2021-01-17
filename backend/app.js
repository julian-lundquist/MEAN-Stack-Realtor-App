const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const Post = require('../src/app/shared/models/post');

mongoose.connect('mongodb://127.0.0.1:27017/realtor?retryWrites=true').then(() => {
  console.log('Connected to Mongo Database');
}).catch(() => {
  console.log('There was an error connecting to the Mongo Database');
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(() => {
    console.log('Post Added Successfully!');
  });

  // res.status(201).json({
  //   message: 'Post Added Successfully!'
  // });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: "2345234",
      name: "Billy"
    },
    {
      id: "1258",
      name: "John Doe"
    }
  ];

  res.status(200).json({
    message: 'Post Fetched Successfully!',
    posts: posts
  });
});

module.exports = app;
