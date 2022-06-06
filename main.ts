enum RadioMessage {
    message1 = 49434,
    increase_db = 24409,
    decrease_db = 42436,
    kill_sound = 3114,
    play_sound = 6322
}
radio.onReceivedNumber(function (receivedNumber) {
    if (running) {
        if (serial_numbers.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber)) >= 0) {
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
radio.onReceivedMessage(RadioMessage.kill_sound, function () {
    music.setBuiltInSpeakerEnabled(false)
    running = false
    basic.showString("Stop")
})
radio.onReceivedMessage(RadioMessage.increase_db, function () {
    dB_threshold += 5
})
radio.onReceivedMessage(RadioMessage.play_sound, function () {
    music.setBuiltInSpeakerEnabled(true)
    running = true
    basic.showString("Go")
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
let serial_numbers: number[] = []
let running = false
let team = 0
team = 0
radio.setTransmitSerialNumber(true)
radio.setTransmitPower(7)
loops.everyInterval(500, function () {
    if (running) {
        radio.sendNumber(0)
    }
})
