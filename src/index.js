require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const swaggerDocs = require('./config/swagger')
const authRouter = require('./routes/authRoutes')
const swiperRouter = require('./routes/swiperRoutes')
const productRoutes = require("./routes/productRoutes")


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

swaggerDocs(app)
connectDB()

app.use("/api/auth", authRouter)
app.use("/api/swiper", swiperRouter)
app.use("/api/product", productRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})
