require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const authRouter = require('./routes/authRoutes')
const swaggerDocs = require('./config/swagger')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

swaggerDocs(app)
connectDB()

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})
