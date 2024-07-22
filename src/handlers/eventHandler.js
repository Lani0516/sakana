require('../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const path = require('path')
const getAllFiles = require("../utils/getAllFiles")

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '../', 'events'), true)
    
    logger.error()
    logger.info("Loaded event listeners:")

    let loop_cnt = 1
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder)
        eventFiles.sort((a, b) => a > b)

        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()
        logger.info(`    ${loop_cnt}. ${eventName}`)

        client.on(eventName, async (arg1, arg2) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile)
                await eventFunction(client, arg1, arg2)
            }
        })
        loop_cnt++
    }
}