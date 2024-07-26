const fs = require('fs')

module.exports = () => {
    const filePath = './chatHistory.json'

    fs.writeFileSync(filePath, JSON.stringify([]))
}