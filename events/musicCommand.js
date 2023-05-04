const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js')

let playingSong = ""

const play_music_command = async (client, message, songListLength) => {
    if (message.content.split(" ").length == 2) {
        const url = message.content.split(" ")[1]
        await client.distube.play(message.member.voice.channel, url, {
            member: message.member,
            textChannel: message.channel,
            message: message
        })
        // const sonObj = {
        //     index: songListLength,
        //     name: client.distube.getQueue(message).songs[songListLength].name,
        //     duration: client.distube.getQueue(message).songs[songListLength].duration,
        //     formattedDuration: client.distube.getQueue(message).songs[songListLength].formattedDuration,
        //     url: client.distube.getQueue(message).songs[songListLength].url,
        //     Requester: client.distube.getQueue(message).songs[songListLength].user
        // }
        // return sonObj
    } else {
        message.reply('format command is => play url')
    }
}

const pause_resume_music_command = async (client, message) => {
    const queue = await client.distube.getQueue(message)
    if (queue.paused) {
        queue.resume()
    } else {
        queue.pause()
    }
}

const skip_music_command = async (client, message, songListLength) => {
    // if (songListLength > 1) {
    //     const queue = await client.distube.getQueue(message).skip()
    // } else {
    //     stop_music_command(client, message)
    //     message.reply("There is no up next song")
    // }
    try {
        const queue = await client.distube.getQueue(message).skip()
    } catch {
        message.reply("There is no up next song")
    }
}

const stop_music_command = async (client, message) => {
    const queue = await client.distube.getQueue(message).stop()
}


const queue_music_command = async (client, message, flag) => {
    const queue = await client.distube.getQueue(message)
    // const exampleEmbed = new EmbedBuilder()
    //     .setColor(0x09ff00)
    //     .setTitle('!!รายการเล่นเพลง!!')
    //     .setDescription("result")
    // const playPauseButton = new ButtonBuilder().setCustomId('Pause_Resume_Button').setLabel('Play/Pause').setStyle(ButtonStyle.Success)
    // const stopButton = new ButtonBuilder().setCustomId('Stop_Button').setLabel('Stop').setStyle(ButtonStyle.Danger)
    // const skipButton = new ButtonBuilder().setCustomId('Skip_Button').setLabel('Skip').setStyle(ButtonStyle.Primary)
    // const music_row = new ActionRowBuilder().addComponents(playPauseButton, stopButton, skipButton)
    // message.reply(
    //     {
    //         embeds: [exampleEmbed],
    //         components: [music_row],
    //     }
    // )
}







module.exports = { play_music_command, pause_resume_music_command, skip_music_command, stop_music_command, queue_music_command }