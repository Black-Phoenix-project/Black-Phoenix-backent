const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.get('/', likeController.getUserLikes);
router.get('/user/:userId', likeController.getUserLikes);
router.get('/check', likeController.checkLike);
router.get('/product/:productId/count', likeController.getProductLikeCount);

router.post('/', likeController.addLike);
router.post('/toggle', likeController.toggleLike);

router.delete('/', likeController.removeLike);

module.exports = router;
