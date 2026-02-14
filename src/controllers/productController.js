const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const product = await Product.create(req.body);

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
    const products = await Product.find().sort({ createdAt: -1 });

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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
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


// ================= PATCH (PARTIAL) =================
exports.patchProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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


// ================= DELETE =================
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
