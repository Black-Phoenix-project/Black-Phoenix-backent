const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: [String],
      required: true,
      validate: {
        validator: function (images) {
          return Array.isArray(images) && images.length >= 1 && images.length <= 3;
        },
        message: 'Product must have between 1 and 3 images'
      }
    },

  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('Product', productSchema);
