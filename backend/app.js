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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(result => {
    res.status(201).json(result);
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = req.body;
  console.log(post)

  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json(result);
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json(posts);
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json(result);
  });
});

module.exports = app;
