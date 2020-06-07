const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

mongoose.connect('mongodb+srv://nodjs-app:Kbtz1JikW7WJ8ZkW@cluster0-rkqqu.mongodb.net/test?retryWrites=true&w=majority'
    , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('CONNECTION SUCCESFUL TO MONGODB'))
    .catch(() => console.log('CONNECTION FAILED '))

const app = express()
// CORS IMPLEMENTATION : this middleware didn't take route in first parameter so we can apply it to every single route
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // allow access to our api from any origin
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
})

// to parse data receive from the form to json
app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images'))) // expose this folder in a static way
app.use('/api/stuff', stuffRoutes)
app.use('/api/auth', userRoutes)
module.exports = app;
