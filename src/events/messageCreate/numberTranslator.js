const { hentaiChannel } = require('../../../config.json')

const { EmbedBuilder } = require('discord.js')

module.exports = async (client, message) => {
    if (message.author.bot) return

    if (!(message.channelId === hentaiChannel)) return

    const content = message.content

    if (isNaN(content)) return

    if (content.length === 6) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: content, iconURL: 'https://archive.org/download/nhentai-logo-3/nhentai-logo-3.jpg', url: `https://nhentai.net/g/${content}/` })
            .setTitle(
                "⚠️｜Work in progress."
            )
            .setColor('#D37676')

        // Link ➡️ fetch thumbnail, title, tag?, image

        await message.channel.send({ embeds: [embed] })
        await message.delete()
    }
}