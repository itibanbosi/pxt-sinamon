/* sinamon V0.1 1023/07/01 */
let 目標P0 = 0
let L_bit = 0
let L_Power = 0
let P0count = 0
let R_power = 0
let 目標P1 = 0
let P1count = 0
let R_bit = 0
led.enable(false)
pins.setEvents(DigitalPin.P6, PinEventType.Edge)
pins.setEvents(DigitalPin.P7, PinEventType.Edge)

control.onEvent(EventBusSource.MICROBIT_ID_IO_P6, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
    R_bit = 1
    for (let index = 0; index < 5; index++) {
        R_bit = R_bit * pins.digitalReadPin(DigitalPin.P6)
    }
    if (R_bit == 1) {
        P1count += 1
        serial.writeValue("R", P1count)
        if (P1count < Math.abs(目標P1)) {
            if (P1count + 10 < Math.abs(目標P1)) {
                R_power = 300
                if (P0count > P1count) {
                    R_power = 100
                }
                if (目標P1 == Math.abs(目標P1)) {
                    右タイヤ前()
                } else {
                    右タイヤ後ろ()
                }
            } else {
                R_power = 550
                if (P0count > P1count) {
                    R_power = 400
                }
                if (目標P1 == Math.abs(目標P1)) {
                    右タイヤ前()
                } else {
                    右タイヤ後ろ()
                }
            }
        } else {
            右タイヤ停止()
        }
    }
})

function 右タイヤ前() {
    pins.analogWritePin(AnalogPin.P15, R_power)
    pins.digitalWritePin(DigitalPin.P16, 1)
}


function 右タイヤ後ろ() {
    pins.digitalWritePin(DigitalPin.P15, 1)
    pins.analogWritePin(AnalogPin.P16, R_power)
}

function 右タイヤ停止() {
    pins.digitalWritePin(DigitalPin.P15, 1)
    pins.digitalWritePin(DigitalPin.P16, 1)
}


//% color="#ff4500" weight=94 
namespace sinamon {

    export enum BT {
        //% block="lighter"
        lighter,
        //% block="darker"
        darker
    }

    //% color="#1E90FF" weight=93 block="Wait time (sec)|%second|" group="1 i:o Neopixel"
    //% second.min=0 second.max=10 second.defl=1
    export function driveForwards(second: number): void {
        basic.pause(second * 1000);
    }


}