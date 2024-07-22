const { EmbedBuilder } = require("discord.js")

module.exports = {
    callback: async (client, interaction) => {
        await interaction.deferReply()

        const reply =  await interaction.fetchReply()

        const ping = reply.createdTimestamp - interaction.createdTimestamp

        const embed = new EmbedBuilder()
            .setAuthor({ name: '成功使用一般指令', iconURL: 'https://cdn.discordapp.com/attachments/1003922992805449780/1264614146046038046/image.png?ex=669e8333&is=669d31b3&hm=1806cdd1442948e2bd73370da5494a8c6c4be5cfd59ffb3d5ef8313bbc65d95b&' })
            .addFields(
                { name: '指令名稱', value: '```ping```'},
                { name: 'Client', value: `\`\`\`${ping}ms\`\`\``, inline: true },
                { name: 'Websocket', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
            )
            .setColor('#B0C5A4')

        interaction.editReply({ embeds: [embed] })
    },

    name: 'ping',
    description: '皮卡丘走路，乒乓乒乓乒乓。',
    // devOnly: true,
    testOnly: true,
    // options: Object[],
}