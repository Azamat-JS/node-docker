const protect = require('../middleware/authmiddleware')
const router = require('express').Router();
const postController = require('../controllers/post.controller');

router
    .route('/')
    .get(postController.getAllPosts)
    .post(protect, postController.createPost)
router
    .route('/:id')
    .get(postController.getOnePost)
    .put(protect, postController.updatePost)
    .delete(postController.deletePost)

module.exports = router;