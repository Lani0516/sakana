require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { devs, testServer } = require('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands')

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return

    const localCommands = getLocalCommands()
    
    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        )

        if (!commandObject) return
        
        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: '只有管理員能使用此指令。',
                    ephemeral: true,
                })
                return
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: '此指令仍在測試中，尚未在此伺服器部署。',
                    ephemeral: true,
                })
                return
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permission.has(permission)) {
                    interaction.reply({
                        content: '您的權限不足以使用此指令。',
                        ephemeral: true,
                    })
                    return
                }
            }
        }

        if (commandObject.botPermission?.length) {
            for (const permission of commandObject.botPermission) {
                const bot = interaction.guild.memeber.me

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "我沒有足夠的權限執行此指令。",
                        ephemeral: true,
                    })
                    return
                }
            }
        }

        await commandObject.callback(client, interaction)

        logger.info(`"${interaction.member.user.displayName}" cast a slash command "/${interaction.commandName}" successfully！`)
    } catch (error) {
        logger.error(`There was an error handling slash commands: ${error}`)
    }
}