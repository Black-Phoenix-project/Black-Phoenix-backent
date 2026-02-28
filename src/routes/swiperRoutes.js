const express = require('express');
const router = express.Router();
const {
    getAllSwipers,
    getSwiperById,
    createSwiper,
    updateSwiper,
    deleteSwiper
} = require('../controllers/swiperController');

router.get('/', getAllSwipers);

router.get('/:id', getSwiperById);

router.post('/', createSwiper);

router.put('/:id', updateSwiper);

router.delete('/:id', deleteSwiper);

module.exports = router;