const { Client, ChannelType, GatewayIntentBits, IntentsBitField, REST, Routes } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { voiceStateUpdate } = require('./events/voiceStateUpdate.js')
const { rollButtonInteraction, rollMessageCreate } = require('./events/roll.js')
const { reportButtonInteraction } = require('./events/report.js')
const { guildMemberAdd } = require('./events/guildMemberAdd.js')

const functions = require('firebase-functions')
// START env setting
const dotenv = require('dotenv')
dotenv.config()
// END env setting
// START Gateway setting
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
})
// NED Gateway setting
// START setup commands and ready events 
const commands = [
    {
        name: 'roll',
        description: 'Randomize a number between the numbers you are given.',
        options: [
            {
                name: 'min',
                description: 'min value for this roll',
                type: 3,
                require: true
            },
            {
                name: 'max',
                description: 'max value for this roll',
                type: 3,
                require: true
            }
        ]
    },
    {
        name: 'button',
        description: 'create button',
    },
]
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
client.on('ready', async (client) => {
    console.log(`Logged in as ${client.user.tag}!`)
    try {
        console.log('Started refreshing application (/) commands.')
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
    // START roll button
    client.channels.fetch('1102281555650564207').then((channel) => {
        const roll_1_10 = new ButtonBuilder().setCustomId('roll_1_10').setLabel('roll between 1 to 10').setStyle(ButtonStyle.Primary)
        const roll_1_100 = new ButtonBuilder().setCustomId('roll_1_100').setLabel('roll between 1 to 100').setStyle(ButtonStyle.Success)
        const roll_1_1000 = new ButtonBuilder().setCustomId('roll_1_1000').setLabel('roll between 1 to 1000').setStyle(ButtonStyle.Danger)
        const roll_row = new ActionRowBuilder().addComponents(roll_1_10, roll_1_100, roll_1_1000)
        channel.send({
            content: `how much to roll ? \n if you want to custom you can use !roll min max \n ex. !roll 1 10`,
            components: [roll_row],
        })
    })
    // END roll button
    // START report button
    client.channels.fetch('1102527207118753885').then((channel) => {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x09ff00)
            .setTitle('Report แบบส่วนตัว')
            .setDescription('กดปุ่มสีเขียวแล้วจะสร้างห้องสำหรับรีพอตโดยจะเห็นแค่ตัวคุณและเหล่า Staff โดยคุณ\nจะต้องเล่าเหตุการณ์ที่เกิดขึ้นตามความเป็นจริงและมีหลักฐานประกอบด้วยจะยิ่งดี')
            .setImage('attachment://report.png')
        const reportButton = new ButtonBuilder().setCustomId('reportButton').setLabel('Report !!!').setStyle(ButtonStyle.Success)
        const report_row = new ActionRowBuilder().addComponents(reportButton)
        channel.send(
            {
                content: `ระบบ Report แบบ เปิด Ticket`,
                embeds: [exampleEmbed],
                components: [report_row],
            }
        )
    })
    // END report button

})
// END setup commands and events

// START messageCreate events
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!roll')) {
        rollMessageCreate(message)
    }
})
// END messageCreate events

// START guildMemberAdd events
client.on('guildMemberAdd', (member) => {
    guildMemberAdd(member)
})
// END guildMemberAdd events


client.on('messageCreate', async (message) => {
    console.log(message.content)
    if (message.content.startsWith('!reply')) {
        setTimeout(() => message.delete(message.id), 2000)
        message.reply('@everyone').then((msg) => {
            setTimeout(() => msg.delete(), 2000)
        })
    }
})



client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton) {
        console.log(interaction.customId)
        if (interaction.customId === 'roll_1_10' || interaction.customId === 'roll_1_100' || interaction.customId === 'roll_1_1000') {
            rollButtonInteraction(interaction)
        }
        if (interaction.customId === 'reportButton') {
            reportButtonInteraction(interaction)
        }
    }
    if (!interaction.isChatInputCommand()) return
    // if (interaction.commandName === 'roll') {
    //     const min = parseInt(interaction.options.data[0].value)
    //     const max = parseInt(interaction.options.data[1].value)
    //     const random = Math.random()
    //     const result = Math.floor(random * (max - min + 1)) + min
    //     await interaction.reply(result.toString())
    // }
    // if (interaction.commandName === 'button') {
    //     const confirm = new ButtonBuilder()
    //         .setCustomId('confirm')
    //         .setLabel('Confirm Ban')
    //         .setStyle(ButtonStyle.Danger)

    //     const cancel = new ButtonBuilder()
    //         .setCustomId('cancel')
    //         .setLabel('Cancel')
    //         .setStyle(ButtonStyle.Secondary)

    //     const row = new ActionRowBuilder()
    //         .addComponents(cancel, confirm)

    //     await interaction.reply({
    //         content: `Are you sure you want to ban ?`,
    //         components: [row],
    //     })
    // }
})









// let voiceRoomState = []
client.on('voiceStateUpdate', async (oldState, newState) => {
    voiceRoomState = voiceStateUpdate(oldState, newState)
    const hiddenCode = () => {
        // if (newState.channelId === '1089992710062088252') {
        //     const newChannel = await newState.guild.channels.create({
        //         name: `ห้องของ ${newState.member.user.username}`,
        //         type: ChannelType.GuildVoice,
        //         parent: '955506682962772113',
        //     })
        //     newState.member.voice.setChannel(newChannel.id)
        //     voiceRoomState.push({
        //         roomId: newChannel.id,
        //         countUser: 0
        //     })
        // }

        // if (newState.channelId !== '1089992710062088252') {
        //     let newVoiceRoomState = []
        //     voiceRoomState.map((room) => {
        //         if (room.roomId === newState.channelId) {
        //             newVoiceRoomState.push({
        //                 roomId: room.roomId,
        //                 countUser: room.countUser + 1
        //             })
        //         } else {
        //             newVoiceRoomState.push({
        //                 roomId: room.roomId,
        //                 countUser: room.countUser
        //             })
        //         }
        //     })
        //     voiceRoomState = newVoiceRoomState
        //     console.log(voiceRoomState, 'voiceRoomState newState')
        // }

        // if (oldState.channelId !== '1089992710062088252') {
        //     let newVoiceRoomState = []
        //     voiceRoomState.map((room) => {
        //         if (room.roomId === oldState.channelId) {
        //             newVoiceRoomState.push({
        //                 roomId: room.roomId,
        //                 countUser: room.countUser - 1
        //             })
        //         } else {
        //             newVoiceRoomState.push({
        //                 roomId: room.roomId,
        //                 countUser: room.countUser
        //             })
        //         }
        //     })
        //     voiceRoomState = newVoiceRoomState
        //     console.log(voiceRoomState, 'voiceRoomState oldState')
        //     const checkRoomState = voiceRoomState.filter((room)=> room.roomId === oldState.channelId)[0]
        //     if (checkRoomState !== undefined && checkRoomState.countUser === 0) {
        //         oldState.guild.channels.delete(checkRoomState.roomId)
        //         voiceRoomState = voiceRoomState.filter((room)=> room.roomId !== oldState.channelId)
        //     }
        // 
    }
})


exports.client = functions.https.onRequest(client.login(process.env.TOKEN))