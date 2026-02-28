const router = require('express').Router();
const controller = require('../controllers/productController');

router.post('/', controller.createProduct);

router.get('/', controller.getAllProducts);

router.get('/:id', controller.getProduct);

router.put('/:id', controller.updateProduct);

router.patch('/:id', controller.patchProduct);

router.delete('/:id', controller.deleteProduct);

module.exports = router;
