const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./config/database')
const authRouter = require('./routes/authRoutes')
const swaggerDocs = require('./config/swagger')

app.use(cors())

app.use(express.json())

const PORT = process.env.PORT || 5000

swaggerDocs(app);
connectDB()

app.use("/api/auth", authRouter)

app.listen(5000, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})