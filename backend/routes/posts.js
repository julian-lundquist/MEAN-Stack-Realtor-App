const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(result => {
    res.status(201).json(result);
  });
});

router.put('/:id', (req, res, next) => {
  const post = req.body;
  console.log(post)

  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json(result);
  });
});

router.get('', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json(posts);
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json(result);
  });
});

module.exports = router;
