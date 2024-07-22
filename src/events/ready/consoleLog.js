require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

module.exports = (client) => {
    logger.error()
    logger.info('Dev:')
    logger.info('    Package: discord.js v14.15.3')
    logger.info('    Status: ✅ Online')
    logger.info('General:')
    logger.info(`    Display Name: ${client.user.displayName}`)
    logger.info(`    Tag: ${client.user.tag.slice(-5)}`)
    logger.info(`    ID: ${client.user.id}`)
    logger.error()
}