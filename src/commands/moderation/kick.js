require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Embed } = require('discord.js')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value
        const reason = interaction.options.get('reason')?.value || "沒有提供原因。"

        await interaction.deferReply()

        const targetUser = interaction.guild.members.fetch(targetUserId)

        if (!targetUser) {
            await interaction.editReply("找不到此用戶。")
            return
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("你無法踢除此用戶。（伺服器持有者）")
        }

        const targetUserRolePosition = (await targetUser).roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("你無法踢除此用戶。（用戶權限高於你或與你相同）")
            return
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("你無法踢除此用戶。（用戶權限高於此機器人）")
            return
        }

        try {
            (await targetUser).kick({reason})

            const embed = new EmbedBuilder()
                .setAuthor({ name: '成功使用管理員指令', iconURL: 'https://cdn.discordapp.com/attachments/1003922992805449780/1264596069426139156/image.png?ex=669e725e&is=669d20de&hm=de32bdc58e2b28cc9d3735732e4263007b6da7999cac0b72255fbfe0d1274840&' })
                .addFields(
                    { name: '使用指令', value: '```kick```'},
                    { name: '作用用戶', value: `\`\`\`${(await targetUser).user.tag}\`\`\``, inline: true },
                    { name: '使用用戶', value: `\`\`\`${interaction.member.user.tag}\`\`\``, inline: true },
                    { name: '使用原因', value: `\`\`\`${reason}\`\`\`` }
                )
                .setColor('#D37676')

            await interaction.editReply({ embeds: [embed] })
        } catch (error) {
            logger.error(`Something went wrong when kicking members: ${error}`)
        }
    },

    name: 'kick',
    description: '踢除指定用戶。',
    // devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'target-user',
            description: '要踢除的用戶。',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: '踢除的原因。',
            type: ApplicationCommandOptionType.String,
        }
    ],
    PermissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}