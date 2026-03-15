const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    resultsCount: {
      type: Number,
      default: 0,
    },

    filters: {
      sort: { type: String, default: 'default' },
      inStock: { type: Boolean, default: false },
      minPrice: { type: Number, default: null },
      maxPrice: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

searchLogSchema.index({ query: 1 });
searchLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchLog', searchLogSchema);
