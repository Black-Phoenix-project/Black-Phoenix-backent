const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productName
 *       properties:
 *         productId:
 *           type: string
 *           description: Reference to product ID
 *         productName:
 *           type: string
 *           description: Name of the product
 *         price:
 *           type: number
 *           description: Product price
 *         quantity:
 *           type: number
 *           default: 1
 *           description: Quantity ordered
 *         image:
 *           type: string
 *           description: Product image URL
 *       example:
 *         productName: IELTS Writing Course
 *         price: 299.99
 *         quantity: 1
 *         image: https://example.com/product.jpg
 *
 *     Order:
 *       type: object
 *       required:
 *         - username
 *         - phoneNumber
 *         - product
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated order ID
 *         username:
 *           type: string
 *           description: Client's username
 *         phoneNumber:
 *           type: string
 *           description: Client's phone number
 *         description:
 *           type: string
 *           description: Order description or client message
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         totalAmount:
 *           type: number
 *           description: Total order amount (price * quantity)
 *         status:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *           default: pending
 *           description: Order status
 *         userId:
 *           type: string
 *           description: Reference to user ID
 *         notes:
 *           type: string
 *           description: Additional notes
 *         paymentStatus:
 *           type: string
 *           enum: [unpaid, paid, refunded]
 *           default: unpaid
 *           description: Payment status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         username: john_doe
 *         phoneNumber: "+998901234567"
 *         description: Need IELTS preparation materials
 *         product:
 *           productName: IELTS Complete Course
 *           price: 299.99
 *           quantity: 1
 *           image: https://example.com/ielts-course.jpg
 *         status: pending
 *         paymentStatus: unpaid
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API for handling product purchases
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Buy button action)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - phoneNumber
 *               - product
 *             properties:
 *               username:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               description:
 *                 type: string
 *               product:
 *                 type: object
 *                 required:
 *                   - productName
 *                 properties:
 *                   productId:
 *                     type: string
 *                   productName:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   image:
 *                     type: string
 *               userId:
 *                 type: string
 *               notes:
 *                 type: string
 *             example:
 *               username: john_doe
 *               phoneNumber: "+998901234567"
 *               description: I want to buy IELTS course
 *               product:
 *                 productId: 507f1f77bcf86cd799439011
 *                 productName: IELTS Speaking & Writing Bundle
 *                 price: 499.99
 *                 quantity: 1
 *                 image: https://example.com/bundle.jpg
 *               userId: 507f1f77bcf86cd799439022
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with filters and pagination
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [unpaid, paid, refunded]
 *         description: Filter by payment status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     summary: Get order statistics
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                     pendingOrders:
 *                       type: number
 *                     completedOrders:
 *                       type: number
 *                     cancelledOrders:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *       500:
 *         description: Server error
 */
router.get('/stats', orderController.getOrderStats);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /api/orders/username/{username}:
 *   get:
 *     summary: Get orders by username
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Client's username
 *     responses:
 *       200:
 *         description: List of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/username/:username', orderController.getOrdersByUsername);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
// router.get('/user/:userId', orderController.getOrdersByUserId);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update entire order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               description:
 *                 type: string
 *               product:
 *                 type: object
 *               status:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/:id', orderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *             example:
 *               status: processing
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/payment:
 *   patch:
 *     summary: Update payment status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [unpaid, paid, refunded]
 *             example:
 *               paymentStatus: paid
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         description: Invalid payment status value
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/payment', orderController.updatePaymentStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', orderController.deleteOrder);

module.exports = router;