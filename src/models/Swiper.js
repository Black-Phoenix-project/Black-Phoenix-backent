const mongoose = require('mongoose');

const swiperSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Image URL is required']
    }, 
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Swiper', swiperSchema);