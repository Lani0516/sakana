require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { voiceCategoryId, voiceChannelPrefix, voiceStatesUpdateChannelId } = require('../../../config.json')

const { ApplicationCommandOptionType, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
    callback: async (client, interaction) => {
        const voiceCategory = interaction.guild.channels.cache.get(voiceCategoryId)

        if (!voiceCategory || voiceCategory.type !== ChannelType.GuildCategory) {
            await interaction.reply({ 
                content: "無效的CategoryId", ephemeral: true,
            })
            return
        }

        const channelName = voiceChannelPrefix + interaction.options.get('name').value
        const userName = interaction.member.nickname ?? interaction.member.displayName

        try {
            const channel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildVoice,
                parent: voiceCategory,
                position: 1,
            })

            channel.permissionOverwrites.create(
                interaction.member,
                {
                    ManageChannels: true,
                    ManageMessages: true,
                    ManageRoles: true,
                },
            )

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${userName} 創建了 ${channelName}`,
                    iconURL: interaction.member.displayAvatarURL()
                })
                .setColor('White')

            client.channels.fetch(voiceStatesUpdateChannelId)
                .then(channel => channel.send({ embeds: [embed] }))

            const userLimit = parseInt(interaction.options.get('user-limit')?.value) || 0

            if (userLimit) {
                if (userLimit > 0) {
                    await channel.setUserLimit(userLimit)
                }
            }
        } catch (error) {
            logger.error(`There is a error creating voice channel: ${error}`)
            return
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "成功使用一般指令", iconURL: 'https://cdn.discordapp.com/attachments/1008425742092214352/1264858860309581854/image.png?ex=669f671c&is=669e159c&hm=14db6927dc177c893e528e7c1651a7f773d30dba097b802e9a5116b5e3d9cc24&'
            })
            .addFields(
                { name: "使用指令", value: '```create```'},
                { name: "頻道名稱", value: `\`\`\`${channelName}\`\`\``, inline: true},
                { name: "使用用戶", value: `\`\`\`${userName}\`\`\``, inline: true},
            )
            .setColor('Green')

        await interaction.reply({ embeds: [embed] })
    },

    name: 'create',
    description: '創建屬於自己的語音房。',
    // devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'name',
            description: "語音房的名稱。",
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'user-limit',
            description: "語音房的人數上限。",
            type: ApplicationCommandOptionType.Integer
        },
    ],
}