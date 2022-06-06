enum RadioMessage {
    message1 = 49434,
    increase_db = 24409,
    decrease_db = 42436,
    kill_sound = 3114,
    play_sound = 6322,
    toggle_pause = 52104
}
radio.onReceivedNumber(function (receivedNumber) {
    if (running) {
        c_index = serial_numbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))
        if (c_index >= 0) {
            datalogger.log(datalogger.createCV(convertToText(c_index), radio.receivedPacket(RadioPacketProperty.SignalStrength)))
            average_db = (average_db * data_count + radio.receivedPacket(RadioPacketProperty.SignalStrength)) / (data_count + 1)
            data_count += 1
            if (radio.receivedPacket(RadioPacketProperty.SignalStrength) <= dB_threshold) {
                recent_time[serial_numbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))] = radio.receivedPacket(RadioPacketProperty.Time)
            } else {
                if (radio.receivedPacket(RadioPacketProperty.Time) - recent_time[serial_numbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))] >= 2500) {
                    soundExpression.hello.play()
                    recent_time[serial_numbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))] = radio.receivedPacket(RadioPacketProperty.Time)
                }
            }
        } else {
            serial_numbers.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
            recent_time[serial_numbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))] = radio.receivedPacket(RadioPacketProperty.Time)
        }
    }
})
radio.onReceivedMessage(RadioMessage.toggle_pause, function () {
    running = !(running)
})
radio.onReceivedMessage(RadioMessage.kill_sound, function () {
    music.setBuiltInSpeakerEnabled(false)
    basic.showString("X")
})
radio.onReceivedMessage(RadioMessage.increase_db, function () {
    dB_threshold += 5
})
radio.onReceivedMessage(RadioMessage.play_sound, function () {
    music.setBuiltInSpeakerEnabled(true)
    basic.showString("O")
})
function setup () {
    radio.setGroup(team)
    serial_numbers = []
    recent_time = []
    dB_threshold = -65
    running = false
    basic.showNumber(team + 1)
    for (let index = 0; index < team + 1; index++) {
        music.playTone(262, music.beat(BeatFraction.Half))
        music.rest(music.beat(BeatFraction.Half))
    }
    average_db = 0
}
radio.onReceivedMessage(RadioMessage.decrease_db, function () {
    dB_threshold += -5
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    team += 1
    if (team == 3) {
        team = 0
    }
    setup()
})
let recent_time: number[] = []
let dB_threshold = 0
let data_count = 0
let average_db = 0
let serial_numbers: number[] = []
let c_index = 0
let running = false
let team = 0
team = 0
radio.setTransmitSerialNumber(true)
radio.setTransmitPower(7)
setup()
loops.everyInterval(500, function () {
    if (running) {
        radio.sendNumber(0)
    }
})
