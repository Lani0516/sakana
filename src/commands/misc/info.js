const { EmbedBuilder } = require("discord.js")

module.exports = {
    callback: async (client, interaction) => {
        await interaction.deferReply()

        const displayName = client.user.displayName
        const userTag = client.user.tag
        const userId = client.user.id

        const embed = new EmbedBuilder()
            .setAuthor({ name: `關於${displayName}`, iconURL: 'https://cdn.discordapp.com/avatars/922839426730700850/e9b5118c897c27f21be66a7e31f6fe55?size=1024' })
            .setTitle(
                `${displayName}是由劉文恩編寫，專門服務於鯊雕派對的機器人。`
            )
            .setDescription(
                `其前身為SharkPBot、サメガール，二者均以Python編寫，而最後皆因大考而終未能完成計畫好的功能。這次${displayName}改頭換面，使用Discord.js下去編程，並採用更乾淨的架構，使編寫的工作更加順暢、完整。`
            )
            .addFields(
                { name: 'Diplay Name', value: `\`\`\`${displayName}\`\`\``, inline: true},
                { name: 'Legacy Tag', value: `\`\`\`${userTag}\`\`\``, inline: true},
                { name: 'User ID', value: `\`\`\`${userId}\`\`\`` },
                { name: 'Core Module', value: '```discord.js```', inline: true },
                { name: 'Version', value: '```v14.15.3```', inline: true },
                { name: 'Source Code', value: '```https://github.com/Lani0516/sakana```' },
                { name: 'Original Author', value: '```https://github.com/notunderctrl```'},
            )
            .setColor('#EBC49F')

        interaction.editReply({ embeds: [embed] })
    },

    name: 'info',
    description: '關於這個機器人。',
    // devOnly: true,
    testOnly: true,
    // options: Object[],
}