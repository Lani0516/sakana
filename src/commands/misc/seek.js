require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { ApplicationCommandOptionType, EmbedBuilder, flag } = require('discord.js')

module.exports = {
    callback: async (client, interaction) => {
        const member = interaction.guild.members.cache.get(interaction.options.get('target-user')?.value) || interaction.member

        const displayName = member.user.displayName
        const nickname = member.nickname || displayName
        const userTag = member.user.tag

        const userId = member.user.id

        const userAvatarUrl = member.user.displayAvatarURL()

        const userJoinTime = member.joinedAt

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "成功使用一般指令", iconURL: 'https://cdn.discordapp.com/attachments/1010970525566251079/1265287727616622652/image.png?ex=66a0f686&is=669fa506&hm=35abe85d45543a2b5390b8881ed086ef4aa9b70438e53b3d89f669b3fa5b90dc&'
            })
            .addFields(
                { name: "使用指令", value: '```seek```'},
                { name: "Nickname", value: `\`\`\`${nickname}\`\`\``},
                { name: "Display Name", value: `\`\`\`${displayName}\`\`\``, inline: true},
                { name: "User Tag", value: `\`\`\`${userTag}\`\`\``, inline: true},
                { name: "User Id", value: `\`\`\`${userId}\`\`\``},
                { name: "Join At", value: `\`\`\`${userJoinTime}\`\`\``},
            )
            .setColor('Green')
            .setImage(userAvatarUrl)
            

        await interaction.reply({ embeds: [embed] })
    },

    name: 'seek',
    description: '查看指定使用者的詳細資訊。',
    // devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'target-user',
            description: "指定的用戶。",
            type: ApplicationCommandOptionType.Mentionable
        },
    ],
}