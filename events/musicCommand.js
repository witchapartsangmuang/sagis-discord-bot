const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const play_music_command = async (client, message) => {
    try {
        if (message.content.split(' ').length == 2) {
            const url = message.content.split(' ')[1]
            await client.distube.play(message.member.voice.channel, url, {
                member: message.member,
                textChannel: message.channel,
                message: message
            })
            await message.reply(`\u23F6 | Song added to queue!`).then((msg) => {
                setTimeout(() => msg.delete(), 1000)
            })
            message.delete()
        } else {
            message.reply('format command is => play url').then((msg) => {
                setTimeout(() => msg.delete(), 5000)
            })
        }
    } catch (e) {
        message.reply('X | No song to play!').then((msg) => {
            setTimeout(() => msg.delete(), 1000)
        })
    }

}

const pause_resume_music_command = async (client, message) => {
    try {
        const queue = await client.distube.getQueue(message)
        if (queue.paused) {
            queue.resume()
            return `\u23F8 | Resumed!`
        } else {
            queue.pause()
            return `\u23F5 | Paused!`
        }
    }
    catch (e) {
        return `X | No song to play!`
    }

}

const skip_music_command = async (client, message) => {
    try {
        const queue = await client.distube.getQueue(message).skip()
    } catch (e) {
        message.reply('There is no up next song!').then((msg) => {
            setTimeout(() => msg.delete(), 1000)
        })
    }
}

const stop_music_command = async (client, message) => {
    try {
        const queue = await client.distube.getQueue(message).stop()
    } catch (e) {
        message.reply('Stopped!').then((msg) => {
            setTimeout(() => msg.delete(), 1000)
        })
    }
}

const queue_music_command = async (client, message, flag) => {
    const queue = await client.distube.getQueue(message)
}

module.exports = { play_music_command, pause_resume_music_command, skip_music_command, stop_music_command, queue_music_command }