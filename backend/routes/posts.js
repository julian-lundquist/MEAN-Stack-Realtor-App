const express = require('express');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Mime Type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');

//get all posts
router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  let fetchedPosts;

  postQuery.find().then(posts => {
    fetchedPosts = posts;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      posts: fetchedPosts,
      totalCount: count
    });
  });
});

//get specific post
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

//create a post
router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creatorId: req.userData.userId
  });

  post.save().then(result => {
    res.status(201).json(result);
  });
});

//update an existing post
router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = req.body;
  post.imagePath = url + '/images/' + req.file.filename;

  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json(result);
  });
});

//delete a post
router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json(result);
  });
});

module.exports = router;
