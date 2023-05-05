const { Client, ChannelType, GatewayIntentBits, IntentsBitField, REST, Routes } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { DisTube } = require('distube')

const { guildMemberAdd } = require('./events/guildMemberAdd.js')
const { play_music_command, pause_resume_music_command, skip_music_command, stop_music_command, queue_music_command } = require('./events/musicCommand.js')
const { reportButtonInteraction } = require('./events/report.js')
const { rollButtonInteraction, rollMessageCreate } = require('./events/roll.js')
const { voiceStateUpdate } = require('./events/voiceStateUpdate.js')

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
// END Gateway setting
// START music bot setting
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
})
// END music bot setting
// START setup commands and ready events 
// const commands = [
//     {
//         name: 'roll',
//         description: 'Randomize a number between the numbers you are given.',
//         options: [
//             {
//                 name: 'min',
//                 description: 'min value for this roll',
//                 type: 3,
//                 require: true
//             },
//             {
//                 name: 'max',
//                 description: 'max value for this roll',
//                 type: 3,
//                 require: true
//             }
//         ]
//     },
//     {
//         name: 'button',
//         description: 'create button',
//     },
// ]
// const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
client.on('ready', async (client) => {
    console.log(`Logged in as ${client.user.tag}!`)
    try {
        console.log('Started refreshing application (/) commands.')
        // await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
    // START roll button
    // client.channels.fetch('1102281555650564207').then((channel) => {
    //     const roll_1_10 = new ButtonBuilder().setCustomId('roll_1_10').setLabel('roll between 1 to 10').setStyle(ButtonStyle.Primary)
    //     const roll_1_100 = new ButtonBuilder().setCustomId('roll_1_100').setLabel('roll between 1 to 100').setStyle(ButtonStyle.Success)
    //     const roll_1_1000 = new ButtonBuilder().setCustomId('roll_1_1000').setLabel('roll between 1 to 1000').setStyle(ButtonStyle.Danger)
    //     const roll_row = new ActionRowBuilder().addComponents(roll_1_10, roll_1_100, roll_1_1000)
    //     channel.send({
    //         content: `how much to roll ? \n if you want to custom you can use !roll min max \n ex. !roll 1 10`,
    //         components: [roll_row],
    //     })
    // })
    // END roll button
    // START report button
    // client.channels.fetch('1102527207118753885').then((channel) => {
    //     const Embed = new EmbedBuilder()
    //         .setColor(0x09ff00)
    //         .setTitle('Report แบบส่วนตัว')
    //         .setDescription('กดปุ่มสีเขียวแล้วจะสร้างห้องสำหรับรีพอตโดยจะเห็นแค่ตัวคุณและเหล่า Staff โดยคุณ\nจะต้องเล่าเหตุการณ์ที่เกิดขึ้นตามความเป็นจริงและมีหลักฐานประกอบด้วยจะยิ่งดี')
    //         .setImage('attachment://report.png')
    //     const reportButton = new ButtonBuilder().setCustomId('reportButton').setLabel('Report !!!').setStyle(ButtonStyle.Success)
    //     const report_row = new ActionRowBuilder().addComponents(reportButton)
    //     channel.send(
    //         {
    //             content: `ระบบ Report แบบ เปิด Ticket`,
    //             embeds: [Embed],
    //             components: [report_row],
    //         }
    //     )
    // })
    // END report button

})
// END setup commands and events

// START guildMemberAdd events
client.on('guildMemberAdd', (member) => {
    guildMemberAdd(member)
})
// END guildMemberAdd events


client.on('messageCreate', async (message) => {
    // START roll messageCreate
    if (message.content.startsWith('roll')) {
        rollMessageCreate(message)
    }
    // END roll messageCreate
    // START music bot messageCreate
    if (message.content.startsWith('play')) {
        play_music_command(client, message)
    }
    if (message.content.startsWith('Pause/Resume') || message.content.startsWith('pause') || message.content.startsWith('resume')) {
        const pause_resume_status = await pause_resume_music_command(client, message)
        message.reply(pause_resume_status).then((msg) => {
            setTimeout(() => msg.delete(), 500)
        })
    }
    if (message.content.startsWith('skip') || message.content.startsWith('\u23ED')) {
        skip_music_command(client, message)
    }
    if (message.content.startsWith('stop') || message.content.startsWith('\u23F9')) {
        stop_music_command(client, message)
    }
    // if (message.content.startsWith('queue')) {
    //     queue_music_command(client, message)
    // }
    // END music bot messageCreate
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton) {
        // START roll button actions
        if (interaction.customId === 'roll_1_10' || interaction.customId === 'roll_1_100' || interaction.customId === 'roll_1_1000') {
            rollButtonInteraction(interaction)
        }
        // END roll button actions
        if (interaction.customId === 'reportButton') {
            reportButtonInteraction(interaction)
        }
        // START music bot button actions
        if (interaction.customId === 'Pause_Resume_Button') {
            interaction.reply(`Pause/Resume`).then((msg) => {
                setTimeout(() => msg.delete(), 500)
            })
        }
        if (interaction.customId === 'Skip_Button') {
            interaction.reply(`\u23ED | Skipped!`).then((msg) => {
                setTimeout(() => msg.delete(), 500)
            })
        } if (interaction.customId === 'Stop_Button') {
            interaction.reply(`\u23F9 | Stopped!`).then((msg) => {
                setTimeout(() => msg.delete(), 500)
            })
        }
        // END music bot button actions

    }
    if (!interaction.isChatInputCommand()) return
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    voiceRoomState = voiceStateUpdate(oldState, newState)
})

client.distube.on('playSong', (queue, song) => {
    const Embed = new EmbedBuilder()
        .setColor(0x09ff00)
        .setTitle('!!รายการเล่นเพลง!!')
        .setDescription(` \u23F5 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user} `)
    const playPauseButton = new ButtonBuilder().setCustomId('Pause_Resume_Button').setLabel('Play/Pause').setStyle(ButtonStyle.Success)
    const skipButton = new ButtonBuilder().setCustomId('Skip_Button').setLabel('Skip').setStyle(ButtonStyle.Primary)
    const stopButton = new ButtonBuilder().setCustomId('Stop_Button').setLabel('Stop').setStyle(ButtonStyle.Danger)
    const music_row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton)
    queue.textChannel.send(
        {
            embeds: [Embed],
            components: [music_row],
        }
    )
}
)

client.login(process.env.TOKEN)