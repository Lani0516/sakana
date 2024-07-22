const { voiceStatesUpdateChannelId } = require('../../../config.json')

const { EmbedBuilder, Embed } = require('discord.js')

module.exports = (client, oldState, newState) => {
    const oldChannel = oldState.channel
    const newChannel = newState.channel

    if (oldChannel === newChannel) return

    const member = oldState.member

    const embed = new EmbedBuilder()
        .setAuthor({ name: member.nickname ?? member.displayName, iconURL: member.displayAvatarURL() })

    if (oldChannel) {
        // Auto Delete
        if (!oldChannel.members.size) {
            const deleteChannelEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${oldChannel.name} 成為了回憶`, iconURL: 'https://cdn.discordapp.com/attachments/1008425742092214352/1264858860309581854/image.png?ex=669f671c&is=669e159c&hm=14db6927dc177c893e528e7c1651a7f773d30dba097b802e9a5116b5e3d9cc24&'
                })
                .setColor('DarkGrey')

            client.channels.fetch(voiceStatesUpdateChannelId)
                .then(channel => channel.send({ embeds: [deleteChannelEmbed] }))

            oldChannel.delete()
        }

        if (newChannel) {
            // Change
            embed
                .setColor('Blue')
                .addFields(
                    { name: "舊語音房", value: `\`\`\`${oldChannel.name}\`\`\``, inline: true },
                    { name: "新語音房", value: `\`\`\`${newChannel.name}\`\`\``, inline: true},
                )
        } else {
            // Leave
            embed
                .setColor('Red')
                .addFields(
                    { name: "離開了", value: `\`\`\`${oldChannel.name}\`\`\`` }
                )
        }
    } else { 
        if (newChannel) {
            // Join
            embed
                .setColor('Green')
                .addFields(
                    { name: "加入了", value: `\`\`\`${newChannel.name}\`\`\`` }
                )
        }
    }

    client.channels.fetch(voiceStatesUpdateChannelId)
        .then(channel => channel.send({ embeds: [embed] }))
}