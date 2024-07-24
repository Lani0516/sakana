require('../../logger')
const winston = require('winston')
const logger = winston.loggers.get('defaultLogger')

const { hentaiChannel } = require('../../../config.json')

const puppeteer = require('puppeteer')

const { EmbedBuilder } = require('discord.js')

module.exports = async (client, message) => {
    if (message.author.bot) return

    if (!(message.channelId === hentaiChannel)) return

    const content = message.content

    if (isNaN(content)) return

    if (content.length === 6) {
        const targetUrl = `https://nhentai.net/g/${content}/`

        const embed = new EmbedBuilder()
            .setAuthor({ name: content, iconURL: 'https://archive.org/download/nhentai-logo-3/nhentai-logo-3.jpg', url: targetUrl })
            .setTitle(
                "⚠️｜Work in progress."
            )
            .setColor('Red');

        let coverSrc, title, artist, tags, favorite

        // Link ➡️ fetch thumbnail, title, tag?, image
        (async () => {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            
            await page.goto(targetUrl)

            // Cover section
            const coverHandle = await page.$('#cover')
            try {
                coverSrc = await page.evaluate(
                    (el) => el.querySelector("a > img").src, coverHandle
                )
            } catch (error) {
                logger.error(`There was an error fetching manga cover: ${error}`)
                return
            }

            // Title section
            const titleHandle = await page.$('.title')
            try {
                title = await page.evaluate(
                    (el) => el.querySelector("span.pretty").textContent, titleHandle
                )
            } catch (error) {
                logger.error(`There was an error fetching titles: ${error}`)
                return
            }

            // Artist and tags
            try {
                const bigTags = await page.$$eval('.tag-container.field-name', a => a.map(e => e.textContent))
                for (const bigTag of bigTags) {
                    const tempArr = JSON.stringify(bigTag).split("\\")

                    if (tempArr.includes('tArtists:')) {
                        const artistArr = bigTag

                        artist = artistArr.split('\n').at(-1).replace(/\t/g, '').replace(/[0-9]/g, '')

                        continue
                    }

                    if (tempArr.includes('tTags:')) {
                        tags = tempArr.at(-1)
                        tags = tags.split('K')

                        tags[0] = tags[0].slice(1)
                        tags.pop()

                        let cnt = 0
                        for (const tag of tags) {
                            tags[cnt] = tag.replace(/[0-9]/g, '')
                            cnt++
                        }

                        continue
                    }
                }
            } catch (error) {
                logger.error(`There was an error fetching artist or tags: ${error}`)
                return
            }

            // Favorite
            try {
                favorite = (await page.$eval(
                    '#info > div > a.btn.btn-primary.btn-disabled.tooltip > span > span',
                    a => a.textContent
                )).replace(/[()]/g, '')
            } catch (error) {
                logger.error(`There was an error fetching favorite count: ${error}`)
                return
            }

            await page.close()
            await browser.close()

            // Edit embed
            embed
                .setTitle(title)
                .addFields(
                    { name: "Tags", value: `\`\`\`${tags.join(', ')}\`\`\`` },
                    { name: "Artist", value: `\`\`\`${artist}\`\`\``, inline: true },
                    { name: "Favorite", value: `\`\`\`${favorite}\`\`\``, inline: true },
                )
                .setImage(coverSrc)

            // Send until fully loaded (or without await)
            await message.channel.send({ embeds: [embed] })
        })()
        await message.delete()
    }
}