require('dotenv').config()

const { aiChannelId } = require('../../../config.json')

// Import gemini
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

module.exports = async (client, message) => {
    if (message.author.bot) return

    if (message.channelId !== aiChannelId) return

    message.channel.sendTyping()

    const prompt = `${message.content}（請用繁體中文回答我）`

    const result = await model.generateContent([prompt])

    await message.reply({
        content: result.response.text(),
        allowedMentions: {
            repliedUser: false
        },
    })
}