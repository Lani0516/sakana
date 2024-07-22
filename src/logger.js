const winston = require('winston')

winston.loggers.add('defaultLogger', {
    level: 'info',
    format: winston.format.cli(),
    transports: [
        new winston.transports.Console(),
    ]
})