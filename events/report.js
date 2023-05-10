const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const reportCreateChannelButtonInteraction = async (interaction) => {
    const newTExtchannel = await interaction.member.guild.channels.create({
        name: `${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: '1105767207801212978',
        permissionOverwrites: [
            {
                id: process.env.EVERYONE_ROLE_ID,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },{
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: process.env.ADMIN_ROLE_ID,
                allow: [PermissionsBitField.Flags.ViewChannel],
            }
        ]
    }).then((channel) => {
        const Embed = new EmbedBuilder()
                .setColor(0x09ff00)
                .setTitle('Report แบบส่วนตัว')
                .setDescription('กดปุ่มสีแดงเพื่อลบช่องแชทนี้')
            const reportDeleteChannelButton = new ButtonBuilder().setCustomId('reportDeleteChannelButton').setLabel('Remove report !!!').setStyle(ButtonStyle.Danger)
            const report_row = new ActionRowBuilder().addComponents(reportDeleteChannelButton)
            channel.send(
                {
                    content:`<@${interaction.user.id}> <@&${process.env.ADMIN_ROLE_ID}>`,
                    embeds: [Embed],
                    components: [report_row],
                }
            )
    })
    interaction.reply('created new report channel!').then((msg) => {
        setTimeout(() => msg.delete(), 1000)
    })
}
const reportDeleteChannelButtonInteraction = async (interaction) => {
    await interaction.channel.delete()
}
module.exports = { reportCreateChannelButtonInteraction, reportDeleteChannelButtonInteraction }
