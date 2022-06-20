require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONN_STRING, ()=>{
    console.log('Database fully Connected')
});

// routes
const auth_routes = require('./routes/auth.route')
const user_routes = require('./routes/user.route')

app.use('/v1/auth', auth_routes)
app.use('/v1/user', user_routes)

app.listen(3000, ()=> console.log('server is running.. on http://localhost:3000'))