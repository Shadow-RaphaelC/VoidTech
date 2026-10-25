//https://docs.expo.dev/versions/latest/sdk/audio/
import { createAudioPlayer } from 'expo-audio'

const cache = {
    tab:   createAudioPlayer(require('../assets/sounds/tab.wav')),
    add:   createAudioPlayer(require('../assets/sounds/add.wav')),
    buy:   createAudioPlayer(require('../assets/sounds/buy.wav')),
    click: createAudioPlayer(require('../assets/sounds/click.wav')),
}

export function playSound(name) {
    try {
        cache[name].seekTo(0)
        cache[name].play()
    } catch (_) {}
}
