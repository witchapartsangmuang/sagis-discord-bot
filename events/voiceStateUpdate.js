const { Client, ChannelType, GatewayIntentBits, IntentsBitField } = require('discord.js')
let voiceRoomState = []
const voiceStateUpdate = async (oldState, newState) => {
    if (newState.channelId === '1089992710062088252') {
        const newChannel = await newState.guild.channels.create({
            name: `ห้องของ ${newState.member.user.username}`,
            type: ChannelType.GuildVoice,
            parent: '955506682962772113',
        })
        newState.member.voice.setChannel(newChannel.id)
        voiceRoomState.push({
            roomId: newChannel.id,
            countUser: 0
        })
    }
    if (newState.channelId !== '1089992710062088252') {
        let newVoiceRoomState = []
        voiceRoomState.map((room) => {
            if (room.roomId === newState.channelId) {
                newVoiceRoomState.push({
                    roomId: room.roomId,
                    countUser: room.countUser + 1
                })
            } else {
                newVoiceRoomState.push({
                    roomId: room.roomId,
                    countUser: room.countUser
                })
            }
        })
        voiceRoomState = newVoiceRoomState
    }
    if (oldState.channelId !== '1089992710062088252') {
        let newVoiceRoomState = []
        voiceRoomState.map((room) => {
            if (room.roomId === oldState.channelId) {
                newVoiceRoomState.push({
                    roomId: room.roomId,
                    countUser: room.countUser - 1
                })
            } else {
                newVoiceRoomState.push({
                    roomId: room.roomId,
                    countUser: room.countUser
                })
            }
        })
        voiceRoomState = newVoiceRoomState
        const checkRoomState = voiceRoomState.filter((room)=> room.roomId === oldState.channelId)[0]
        if (checkRoomState !== undefined && checkRoomState.countUser === 0) {
            oldState.guild.channels.delete(checkRoomState.roomId)
            voiceRoomState = voiceRoomState.filter((room)=> room.roomId !== oldState.channelId)
        }
    }
}
module.exports = { voiceStateUpdate }