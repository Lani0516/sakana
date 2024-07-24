require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { ActivityType } = require('discord.js')

module.exports = (client) => {
    try {
        client.user.setActivity({
            name: 'Custom Status',
            type: ActivityType.Custom,
            state: "🔎 快使用 /create，創建屬於自己的語音房！",
        })

        logger.info('Set custom activity successfully！')
    } catch (error) {
        logger.error(`There was a error setting custom status: ${error}`)
    }
}