/* sinamon V0.1 1023/07/01 */
let 目標P0 = 0
let L_bit = 0
let L_Power = 0
let P0count = 0
let R_power = 0
let 目標P1 = 0
let P1count = 0
let R_bit = 0
let Lmoter = 0
let Rmoter = 0
led.enable(false)
pins.setEvents(DigitalPin.P6, PinEventType.Edge)
pins.setEvents(DigitalPin.P7, PinEventType.Edge)





//% color="#ff4500" weight=94 
namespace sinamon {



    //% color="#1E90FF" weight=93 block="Wait time (sec)|%second|" group="1 sinamon"
    //% second.min=0 second.max=10 second.defl=1
    export function driveForwards(second: number): void {
        basic.pause(second * 1000);
    }

    //% color="#808080" weight=82 block="forward |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function forward(step: number):void {
        Lmoter = 0
        Rmoter = 0
        回転数(step, step)
        左タイヤ前()
        右タイヤ前()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
    }

    //% color="#808080" weight=80 block="right |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function right(step: number): void {
        Lmoter = 0
        Rmoter = 0
        回転数(step, step * -1)
        左タイヤ前()
        右タイヤ後ろ()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
    }



    //% color="#808080" weight=80 block="left |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function left(step: number): void {
        Lmoter = 0
        Rmoter = 0
        回転数(step*-1, step)
        左タイヤ後ろ()
        右タイヤ前()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
    }



    function 回転数(数値: number, 数値2: number) {
        P1count = 0
        P0count = 0
        目標P0 = 数値
        目標P1 = 数値2
        R_power = 0
    }


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

    function 左タイヤ前() {
        pins.digitalWritePin(DigitalPin.P2, 1)
        pins.analogWritePin(AnalogPin.P13, L_Power)
    }
    function 左タイヤ後ろ() {
        pins.analogWritePin(AnalogPin.P2, L_Power)
        pins.digitalWritePin(DigitalPin.P13, 1)
    }


    function 左タイヤ停止() {
        pins.digitalWritePin(DigitalPin.P2, 1)
        pins.digitalWritePin(DigitalPin.P13, 1)
    }


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
                Rmoter = 1
            }
        }
    })

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P7, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
        L_bit = 1
        for (let index = 0; index < 5; index++) {
            L_bit = L_bit * pins.digitalReadPin(DigitalPin.P7)
        }
        if (L_bit == 1) {
            P0count += 1
            serial.writeValue("L", P0count)
            if (P0count < Math.abs(目標P0)) {
                if (P0count + 10 < Math.abs(目標P0)) {
                    L_Power = 300
                    if (P0count < P1count) {
                        L_Power = 100
                    }
                    if (目標P0 == Math.abs(目標P0)) {
                        左タイヤ前()
                    } else {
                        左タイヤ後ろ()
                    }
                } else {
                    L_Power = 550
                    if (P0count < P1count) {
                        L_Power = 400
                    }
                    if (目標P0 == Math.abs(目標P0)) {
                        左タイヤ前()
                    } else {
                        左タイヤ後ろ()
                    }
                }
            } else {
                左タイヤ停止()
                Lmoter = 1
            }
        }
    })






}