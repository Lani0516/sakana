require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { testServer } = require('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands')
const getApplicationCommands = require('../../utils/getApplicationCommands')
const areCommandsDifferent = require('../../utils/areCommandsDifferent')

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand

            const exisingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            )

            if (exisingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(exisingCommand.id)
                    loggger.info(`Slash command "${name}" is deleted.`)
                    continue
                }

                if (areCommandsDifferent(exisingCommand, localCommand)) {
                    await applicationCommands.edit(exisingCommand.id, {
                        description,
                        options,
                    })
                    logger.warn(`Slash command "${name}" is edited.`)
                }
            } else {
                if (localCommand.deleted) {
                    logger.error(`Slash command "${name}" is skipped.`)
                    continue
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                })

                logger.info(`Slash Command | ${name} | is registered.`)
            }
        } 
    } catch (error) {
        logger.error(error);
    }
};