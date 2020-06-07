const Thing = require('../models/Thing')
const fs = require('fs')
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing)
    delete thingObject._id
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    })
    thing.save()
        .then(() => res.status(201).json({message: 'Object Saved'}))
        .catch(error => res.status(400).json(error))
}

exports.getAllStuff = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}))
}
exports.getOneThing = (req, res, next) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({error}))
}

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } : {...req.body}
    Thing.updateOne(
        {_id: req.params.id},
        {...thingObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Object updated'}))
        .catch(error => res.status(400).json({error}))
}
exports.deleteThing = (req, res, next) => {
    // we want to find the object which id is in the request in the database and it related images name
    Thing.findOne({_id: req.params.id})
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1] // this for extracting the filename we want to delete
            // unlink to delete a file
            // when the file is deleted we delete the object in the database
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Object deleted '}))
                    .catch(error => res.status(400).json({error}))
            })
        })
        .catch(error => res.status(500).json({error}))


}