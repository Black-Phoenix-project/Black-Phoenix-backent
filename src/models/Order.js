const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Client Information
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  
  // Product Information
  product: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      required: false,
    },
  },
  
  // Order Details
  totalAmount: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  
  // Additional Info
  notes: {
    type: String,
    required: false,
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);