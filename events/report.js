const { Client, ChannelType, GatewayIntentBits, IntentsBitField } = require('discord.js')
const reportButtonInteraction = (interaction) => {
    console.log(interaction.user,'user')
    console.log(interaction.member.guild.channels,'channels')

    interaction.member.guild.channels.create({
        name: `ห้องของ ${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: '955506682962772113',
    })
    
}
module.exports = { reportButtonInteraction }