
const clearChatMessage = async (client, message) => {
    message.channel.messages.fetch().then(messages => {
        message.reply(`${messages.size-1} message(s) is removing`).then((msg) => {
            setTimeout(() => msg.delete(), 5000)
        })
        messages.forEach((message) => {
            message.delete()
        })
    })
}
module.exports = { clearChatMessage }