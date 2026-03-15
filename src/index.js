require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const swaggerDocs = require('./config/swagger');
const authRouter = require('./routes/authRoutes');
const clientAuthRouter = require('./routes/authClient');
const swiperRouter = require('./routes/swiperRoutes');
const productRoutes = require('./routes/productRoutes');
const workerRoutes = require('./routes/workersRoute');
const orderRoutes = require('./routes/orderRoutes');
const likeRoutes = require('./routes/likeRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

swaggerDocs(app);
connectDB();

app.use('/api/auth', authRouter);
app.use('/api/client-auth', clientAuthRouter);
app.use('/api/swiper', swiperRouter);
app.use('/api/product', productRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
