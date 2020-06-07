const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') // first argument null to specify that there is no problem | and in second argument the file destination
    },
    filename: (req, file, callback) => {
        // to avoid problem caused by space in the filename we split it by space and join it we underscore
        const name = file.originalname.split(' ').join('_')
        // get the file extension through the mimetype from our dictionnary because we know the mimetype but we can't have directly the file extensions
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})
// we export our element multer which is configured and specify that we handle only image file upload
module.exports = multer({storage}).single('image')
