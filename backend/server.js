const http = require('http');
const app = require('./app');

// this function return a valid port which can be number or a valid chain
const normalizePort = val => {
    const port = parseInt(val, 10)
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port);

// search different error may occurs and handle it properly
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw  error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'requires elevated privileges.')
            process.exit(1)
            break
        case "EADDRINUSE":
            console.error(bind + 'is already in use ')
            process.exit(1)
            break
        default:
            throw error
    }
}

const server = http.createServer(app);

server.on('error', errorHandler) // errorHandler is register in the server
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})

server.listen(port)

module.exports = server