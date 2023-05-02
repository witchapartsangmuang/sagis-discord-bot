const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const guildMemberAdd = (member) => {
    member.guild.channels.fetch('955506682962772111').then((channel) => {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x09ff00)
            .setTitle(' 🎉🎉✌✌ ยินดีต้อนรับเข้าสู่เซิฟเวอร์ ✌✌🎉🎉 ')
            .setThumbnail(member.user.avatarURL())
            .setDescription(` ヅ ヅ ${member.user.username}#${member.user.discriminator} ヅ ヅ \n ดูแลเพื่อนใหม่ด้วนะครับทุกคน!!`)
            .setImage('https://d1csarkz8obe9u.cloudfront.net/posterpreviews/welcome-design-template-9aa14ff9ecf8f172a9ff8dcedcae9657_screen.jpg?ts=1567076070')
        channel.send(
            {
                embeds: [exampleEmbed],
            }
        )
    })

}
module.exports = { guildMemberAdd }