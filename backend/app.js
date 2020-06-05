const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Thing = require('./models/Thing')

mongoose.connect('mongodb+srv://nodjs-app:Kbtz1JikW7WJ8ZkW@cluster0-rkqqu.mongodb.net/test?retryWrites=true&w=majority'
    , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('CONNECTION SUCCESFUL TO MONGODB'))
    .catch(() => console.log('CONNECTION FAILED '))

// CORS IMPLEMENTATION : this middleware didn't take route in first parameter so we can apply it to every single route
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // allow access to our api from any origin
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
})

// to parse data receive from the form to json
app.use(bodyParser.json())

app.post('/api/stuff', (req, res, next) => {
    delete req.body._id
    const thing = new Thing({
        ...req.body
    })
    thing.save()
        .then(() => res.status(201).json({message: 'Object Saved'}))
        .catch(error => res.status(400).json({error}))
})

app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne(
        {_id: req.params.id}, // which object to update id
        {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: "Object updated"}))
        .catch(error => res.status(400).json({error}))
})
app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: "Object deleted"}))
        .catch(error => res.status(400).json({error}))
})
app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json(error))
})

app.get('/api/stuff', (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}))
})

module.exports = app;
