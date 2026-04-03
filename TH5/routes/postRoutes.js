const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/blogposts/new', postController.createPost);
router.post('/blogposts/store', postController.storePost);
router.get('/blogposts/:id', postController.getPost);
router.get('/blogposts/edit/:id', postController.editPost);
router.post('/blogposts/update/:id', postController.updatePost);
router.post('/blogposts/delete/:id', postController.deletePost);

module.exports = router;