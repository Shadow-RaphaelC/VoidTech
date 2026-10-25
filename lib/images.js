export const images = {
    'Alfa.png': require('../assets/img/Alfa-Photoroom.png'),
    'bash-bunny-mk2.png': require('../assets/img/bash-bunny-mk2-Photoroom.png'),
    'flipper-zero.png': require('../assets/img/flipper-zero.png'),
    'HackRF One.png': require('../assets/img/HackRF One-Photoroom.png'),
    'lan-turtle.png': require('../assets/img/lan-turtle-Photoroom.png'),
    'omgmain.png': require('../assets/img/omgmain.png'),
    'ProxMark3.png': require('../assets/img/ProxMark3-Photoroom.png'),
    'shark_thumb.png': require('../assets/img/shark_thumb-Photoroom.png'),
    'usb-rubber-ducky_mk2.png': require('../assets/img/usb-rubber-ducky_mk2-Photoroom.png'),
    'wifi_pineapple.png': require('../assets/img/wifi_pineapple-Photoroom.png'),
}

export function getImage(filename) {
    return images[filename] ?? null
}
