const express = require('express');
const router = express.Router();
const {
    getAllSwipers,
    getSwiperById,
    createSwiper,
    updateSwiper,
    deleteSwiper
} = require('../controllers/swiperController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Swiper:
 *       type: object
 *       required:
 *         - image
 *         - title
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         image:
 *           type: string
 *           description: URL of the swiper image
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Title of the swiper slide
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Description of the swiper slide
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the swiper was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the swiper was last updated
 *       example:
 *         _id: 65a1b2c3d4e5f6g7h8i9j0k1
 *         image: https://example.com/image1.jpg
 *         title: Welcome Slide
 *         description: This is our welcome slide with important information
 *         createdAt: 2024-01-15T10:30:00.000Z
 *         updatedAt: 2024-01-15T10:30:00.000Z
 *     
 *     SwiperInput:
 *       type: object
 *       required:
 *         - image
 *         - title
 *         - description
 *       properties:
 *         image:
 *           type: string
 *           description: URL of the swiper image
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Title of the swiper slide
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Description of the swiper slide
 *       example:
 *         image: https://example.com/image1.jpg
 *         title: Welcome Slide
 *         description: This is our welcome slide with important information
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Swiper
 *   description: Swiper/Carousel management API
 */

/**
 * @swagger
 * /api/swiper:
 *   get:
 *     summary: Get all swiper items
 *     tags: [Swiper]
 *     description: Retrieve all swiper items sorted by creation date (newest first)
 *     responses:
 *       200:
 *         description: Successfully retrieved all swiper items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Swiper'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAllSwipers);

/**
 * @swagger
 * /api/swiper/{id}:
 *   get:
 *     summary: Get a swiper item by ID
 *     tags: [Swiper]
 *     description: Retrieve a single swiper item by its MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the swiper item
 *         example: 65a1b2c3d4e5f6g7h8i9j0k1
 *     responses:
 *       200:
 *         description: Successfully retrieved swiper item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Swiper'
 *       404:
 *         description: Swiper item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Swiper item not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getSwiperById);

/**
 * @swagger
 * /api/swiper:
 *   post:
 *     summary: Create a new swiper item
 *     tags: [Swiper]
 *     description: Create a new swiper/carousel item with image, title, and description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SwiperInput'
 *     responses:
 *       201:
 *         description: Swiper item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Swiper item created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Swiper'
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please provide all required fields
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createSwiper);

/**
 * @swagger
 * /api/swiper/{id}:
 *   put:
 *     summary: Update a swiper item
 *     tags: [Swiper]
 *     description: Update an existing swiper item by ID. All fields are optional.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the swiper item
 *         example: 65a1b2c3d4e5f6g7h8i9j0k1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: URL of the swiper image
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 description: Title of the swiper slide
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description of the swiper slide
 *             example:
 *               title: Updated Welcome Slide
 *               description: This is our updated welcome slide
 *     responses:
 *       200:
 *         description: Swiper item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Swiper item updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Swiper'
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       404:
 *         description: Swiper item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Swiper item not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateSwiper);

/**
 * @swagger
 * /api/swiper/{id}:
 *   delete:
 *     summary: Delete a swiper item
 *     tags: [Swiper]
 *     description: Delete a swiper item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the swiper item
 *         example: 65a1b2c3d4e5f6g7h8i9j0k1
 *     responses:
 *       200:
 *         description: Swiper item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Swiper item deleted successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Swiper item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Swiper item not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteSwiper);

module.exports = router;