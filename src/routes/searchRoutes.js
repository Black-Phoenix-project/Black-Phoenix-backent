const router = require('express').Router();
const { search } = require('../controllers/searchController');

// GET /api/search?q=...&sort=...&inStock=1&minPrice=...&maxPrice=...&page=1&limit=20
router.get('/', search);

module.exports = router;
