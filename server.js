var express = require('express');
var exec = require('child_process').exec;
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var debug = require('debug')('main');
var app = express();

var api = require('./app');
var token = require('./app/token');

console.log('========================================');
console.log('RUNNING REGISTRATION SERVER');
console.log('========================================');
// view engine setup
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'jade');

app.get('/', function(req, res, next) {
    res.send('Unknown resource');
});
app.use('/api', function(req, res, next) {
    debug('server.js', req.url, req.method);
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/api/oauth', api.token);
app.use('/api/employee', api.employee);
app.use('/api/version', function(req, res) {
    exec('git log --stat -1', function(error, stdout, stderr) {
        if (error) {
            res.status(404);
        } else {
            res.status(200);
        }

        res.send('<div style="white-space: pre">' + stdout + '</div>');
    });
});

// Member section
app.use('*', function(req, res, next) {
    debug('server: req.body', req.body);
    var params = {
        token: req.headers.authorization
    };
    if (!params.token) {
        res.status(401).json({
            code: 'invalidToken',
            description: 'Valid Token Required'
        });
    } else {
        debug('checking token', params, req.headers);
        token.validate(params).then(function(val) {
            req.body.employeeUsername = val.username;
            next();
        }, function(err) {
            res.status(401).json({
                code: 'invalidToken',
                description: 'Valid Token Required'
            });
        });
    }
});
app.use('/api/profile', api.profile);
app.use('/api/suggestion', api.suggestion);
app.use('/api/star', api.star);
app.use('/api/registration', api.registration);
app.use('/api/users', api.users);
app.use('/api/logging', api.logging);
app.use('/api/servicehealth', api.serviceHealth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Resource not found');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
