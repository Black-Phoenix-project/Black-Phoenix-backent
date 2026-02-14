const Swiper = require('../models/Swiper');


exports.getAllSwipers = async (req, res) => {
    try {
        const swipers = await Swiper.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: swipers.length,
            data: swipers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

exports.getSwiperById = async (req, res) => {
    try {
        const swiper = await Swiper.findById(req.params.id);
        
        if (!swiper) {
            return res.status(404).json({
                success: false,
                message: 'Swiper item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: swiper
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Swiper item not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.createSwiper = async (req, res) => {
    try {
        const { image, title, description } = req.body;
        
        if (!image || !title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: image, title, description'
            });
        }
        
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(image)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid image URL'
            });
        }
        
        const swiper = await Swiper.create({
            image,
            title,
            description
        });
        
        res.status(201).json({
            success: true,
            message: 'Swiper item created successfully',
            data: swiper
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

exports.updateSwiper = async (req, res) => {
    try {
        const { image, title, description } = req.body;
        
        const updateFields = {};
        if (image) updateFields.image = image;
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        
        if (image) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(image)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid image URL'
                });
            }
        }
        
        const swiper = await Swiper.findByIdAndUpdate(
            req.params.id,
            updateFields,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!swiper) {
            return res.status(404).json({
                success: false,
                message: 'Swiper item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Swiper item updated successfully',
            data: swiper
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Swiper item not found'
            });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.deleteSwiper = async (req, res) => {
    try {
        const swiper = await Swiper.findByIdAndDelete(req.params.id);
        
        if (!swiper) {
            return res.status(404).json({
                success: false,
                message: 'Swiper item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Swiper item deleted successfully',
            data: {}
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Swiper item not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};