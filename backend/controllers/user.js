const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') // this for create token and check them
const User = require('../models/user')


exports.signup = (req, res, next) => {
    // here below we call bcrypt function in the password and salt them more the value of salter is higher more the password is secure
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // we create and save user in our databases
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({message: 'User created'}))
                .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'User not found '}) // we send 401 Unauthorized
            }
            bcrypt.compare(req.body.password, user.password) // compare password entered by user and the hash svaed in the database
                .then( valid => {
                    if (!valid) { // a boolean is send as argument to check if the comparaison is valable or not
                        return res.status(401).json({error: 'Incorrect Passowrd '})
                    }
                    // if valid we send the result to the frontend || here we created token from the server side and send it to the frontend
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId : user._id}, // data encoded in the token
                            'RANDOM_TOKEN_SECRET', // we use for the purpose of development a temporary secret chain
                            {expiresIn:'24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({error})) // this catch to handle error with mongo Db
        })
        .catch(error => res.status(500).json({error})) // this catch to handle error with mongo Db
}