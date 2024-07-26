require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

require('dotenv').config()

const { aiChannelId } = require('../../../config.json')

const fs = require('fs')

// Import gemini
const { GoogleGenerativeAI } = require("@google/generative-ai")

module.exports = async (client, message) => {
    if (message.author.bot) return

    if (message.channelId !== aiChannelId) return

    message.channel.sendTyping()

    // When user is replying to a message
    let prompt
    try {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId)
        prompt = `${message.content}（${repliedTo.content}）`
    } catch (error) {
        prompt = message.content
    }

    // Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const filePath = './chatHistory.json'

    // TODO: Make this into a reusable utility
    const historyList = JSON.parse(fs.readFileSync(filePath).toString())

    const chat = model.startChat({ history: historyList })

    // Pass when unsafe
    try {
        const result = await chat.sendMessage([prompt])

        await message.reply({
            content: result.response.text(),
            allowedMentions: {
                repliedUser: false
            }
        })

        fs.writeFile(filePath, JSON.stringify(await chat.getHistory(), null, 2), (err) => {
            if (err) logger.error(err)
        })
    } catch (error) {
        logger.error(`There was error generating prompt: ${error}`)
        
        await message.reply("你的言論不安全，造成機器人的崩潰。")

        return
    }
}