const Product = require('../models/Product');

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    return value.filter((img) => typeof img === 'string' && img.trim());
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const images = normalizeImages(req.body.image ?? req.body.images);

    if (!name || !description || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Name, description and price are required'
      });
    }

    if (images.length < 1 || images.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Image count must be between 1 and 3'
      });
    }

    const payload = {
      ...req.body,
      image: images
    };
    delete payload.images;

    const product = await Product.create(payload);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product .findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const payload = { ...req.body };
    const imageFieldProvided = Object.prototype.hasOwnProperty.call(req.body, 'image')
      || Object.prototype.hasOwnProperty.call(req.body, 'images');

    if (imageFieldProvided) {
      const images = normalizeImages(req.body.image ?? req.body.images);
      if (images.length < 1 || images.length > 3) {
        return res.status(400).json({
          success: false,
          message: 'Image count must be between 1 and 3'
        });
      }
      payload.image = images;
      delete payload.images;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.patchProduct = async (req, res) => {
  try {
    const payload = { ...req.body };
    const imageFieldProvided = Object.prototype.hasOwnProperty.call(req.body, 'image')
      || Object.prototype.hasOwnProperty.call(req.body, 'images');

    if (imageFieldProvided) {
      const images = normalizeImages(req.body.image ?? req.body.images);
      if (images.length < 1 || images.length > 3) {
        return res.status(400).json({
          success: false,
          message: 'Image count must be between 1 and 3'
        });
      }
      payload.image = images;
      delete payload.images;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: 'Not found' });

    res.status(200).json({
      success: true,
      message: 'Deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
