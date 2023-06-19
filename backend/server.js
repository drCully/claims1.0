require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())

app.use(cookieParser())

app.use('/register', require('./routes/registerRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/refresh', require('./routes/refreshRoutes'))
app.use('/signout', require('./routes/signoutRoutes'))
app.use('/checks', require('./routes/api/checkRoutes'))
app.use('/claims', require('./routes/api/claimRoutes'))
app.use('/clients', require('./routes/api/clientRoutes'))
app.use('/charges', require('./routes/api/chargeRoutes'))
app.use('/invoices', require('./routes/api/invoiceRoutes'))
app.use('/payees', require('./routes/api/payeeRoutes'))
app.use('/profile', require('./routes/api/profileRoutes'))
app.use('/timeslips', require('./routes/api/timeslipRoutes'))
app.use('/users', require('./routes/api/userRoutes'))

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
