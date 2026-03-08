const mongoose = require('mongoose');
const Like = require('../models/likeModel');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.addLike = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'userId and productId are required',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId or productId',
      });
    }

    const existing = await Like.findOne({ userId, productId })
      .populate('productId')
      .lean();

    if (existing) {
      return res.status(200).json({
        success: true,
        liked: true,
        message: 'Already liked',
        data: existing,
      });
    }

    const created = await Like.create({ userId, productId });
    const populated = await Like.findById(created._id).populate('productId').lean();

    return res.status(201).json({
      success: true,
      liked: true,
      message: 'Product liked successfully',
      data: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding like',
      error: error.message,
    });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const productId = req.body.productId || req.query.productId;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'userId and productId are required',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId or productId',
      });
    }

    const removed = await Like.findOneAndDelete({ userId, productId });

    return res.status(200).json({
      success: true,
      liked: false,
      message: removed ? 'Like removed successfully' : 'Like not found',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error removing like',
      error: error.message,
    });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'userId and productId are required',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId or productId',
      });
    }

    const existing = await Like.findOne({ userId, productId });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      return res.status(200).json({
        success: true,
        liked: false,
        message: 'Like removed successfully',
      });
    }

    const created = await Like.create({ userId, productId });
    const populated = await Like.findById(created._id).populate('productId').lean();

    return res.status(201).json({
      success: true,
      liked: true,
      message: 'Product liked successfully',
      data: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message,
    });
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId',
      });
    }

    const likes = await Like.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: likes.length,
      data: likes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching likes',
      error: error.message,
    });
  }
};

exports.checkLike = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'userId and productId are required',
      });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId or productId',
      });
    }

    const like = await Like.findOne({ userId, productId }).lean();

    return res.status(200).json({
      success: true,
      liked: Boolean(like),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking like status',
      error: error.message,
    });
  }
};

exports.getProductLikeCount = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid productId',
      });
    }

    const count = await Like.countDocuments({ productId });

    return res.status(200).json({
      success: true,
      productId,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product like count',
      error: error.message,
    });
  }
};
