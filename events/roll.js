const rollButtonInteraction = async (interaction) => {
    if (interaction.customId === 'roll_1_10') {
        const result = Math.floor(Math.random() * (10 - 1 + 1)) + 1
        console.log(interaction.user.username, 'interaction')
        await interaction.reply(`${interaction.user.username} roll ${result.toString()} point(s)`).then((msg) => {
            setTimeout(() => msg.delete(), 10000)
        })
    }
    if (interaction.customId === 'roll_1_100') {
        const result = Math.floor(Math.random() * (100 - 1 + 1)) + 1
        await interaction.reply(`${interaction.user.username} roll ${result.toString()} point(s)`).then((msg) => {
            setTimeout(() => msg.delete(), 10000)
        })
    }
    if (interaction.customId === 'roll_1_1000') {
        const result = Math.floor(Math.random() * (1000 - 1 + 1)) + 1
        await interaction.reply(`${interaction.user.username} roll ${result.toString()} point(s)`).then((msg) => {
            setTimeout(() => msg.delete(), 10000)
        })
    }
}
const rollMessageCreate = async (message) => {
    setTimeout(() => message.delete(), 2000)
    const messageContent = message.content.split(" ")
    if (messageContent.length === 3 && parseInt(messageContent[1]) <= parseInt(messageContent[2])) {
        const result = Math.floor(Math.random() * (parseInt(messageContent[2]) - 1 + 1)) + parseInt(messageContent[1])
        message.reply(`${message.author.username} roll ${result.toString()} point(s)`).then((msg) => {
            setTimeout(() => msg.delete(), 10000)
        })
    } else {
        message.reply('Please write in the correct format. (!roll min max) ex. !roll 1 10').then((msg) => {
            setTimeout(() => msg.delete(), 5000)
        })
    }
}
module.exports = { rollButtonInteraction, rollMessageCreate }