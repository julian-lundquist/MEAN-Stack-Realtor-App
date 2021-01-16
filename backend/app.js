const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/posts', (req, res, next) => {
  res.status(201).json({
    message: 'Post Added Successfully!'
  });
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
