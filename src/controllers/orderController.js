const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { username, phoneNumber, description, product, userId, notes } = req.body;

    if (!username || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Username and phoneNumber are required' });
    }

    if (!product || !product.productName) {
      return res.status(400).json({ success: false, message: 'Product information is required' });
    }

    // ✅ FIX: totalAmount = price * quantity
    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 1;
    const totalAmount = price * quantity;

    const newOrder = new Order({
      username,
      phoneNumber,
      description,
      product: {
        productId: product.productId,
        productName: product.productName,
        price: price,          
        quantity: quantity,   
        image: product.image,
      },
      totalAmount,             
      userId,
      notes,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('userId', 'username phoneNumber avatar')
    
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username phoneNumber avatar');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
  }
};

exports.getOrdersByUsername = async (req, res) => {
  try {
    const orders = await Order.find({ username: req.params.username })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];

    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.status(200).json({ success: true, message: 'Payment status updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating payment status', error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    if (req.body.product) {
      const price = Number(req.body.product.price) || 0;
      const quantity = Number(req.body.product.quantity) || 1;
      req.body.totalAmount = price * quantity;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.status(200).json({ success: true, message: 'Order updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const last7Days = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        last7Days, 
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
  }
};