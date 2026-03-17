const router = require('express').Router();
const upload = require('../middleware/upload');
const { uploadSingle, uploadMultiple } = require('../controllers/uploadController');

// Bitta rasm yuklash (swiper uchun)
router.post('/single', upload.single('image'), uploadSingle);

// 1-3 ta rasm yuklash (product uchun)
router.post('/multiple', upload.array('images', 3), uploadMultiple);

module.exports = router;
