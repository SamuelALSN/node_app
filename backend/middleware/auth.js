const jwt = require('jsonwebtoken')

// this middleware will be apply before our routes controllers
module.exports = (req, res, next) => {
    try {
        // extract token from the header Authorization of the incoming request
        // we split it because the header Authorization value contains Bearer separated by space and token
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') // we use this function verify to decode our token if it not valid an error will be generated
        const userId = decodedToken.userId // retrieve the userId we encoded (extract user Id from our token )

        // if the incoming request token contains an userId we compare it to the user id extract from the token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID not valid '
        }else {
            // everything is working and user is authenticated we pass the execution to the fuction
            next()
        }
    } catch (error) {
        res.status(401).json({error: error | 'This request is not authtentified '})
    }
}