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
let noservo = 0
led.enable(false)
pins.setEvents(DigitalPin.P6, PinEventType.Edge)
pins.setEvents(DigitalPin.P7, PinEventType.Edge)





//% color="#ff4500" weight=94 
namespace sinamon {


    export enum kyori {
        //% block="long"
        long,
        //% block="short",
        short
    }



    export enum onoff {
        //% block="ON"
        ON,
        //% block="OFF"
        OFF
    }
    export enum whiteblack {
        //% block="black"
        black,
        //% block="white"
        white
    }


    export enum direction {
        //% block="forward"
        forward,
        //% block="right",
        right,
        //% block="left",
        left,
        //% block="right_rotation",
        right_rotation,
        //% block="left_rotation",
        left_rotation,
        //% block="backward",
        backward,
        //% block="Stop",
        Stop
    }



    //% color="#1E90FF" weight=93 block="Wait time (sec)|%second|" group="1 sinamon"
    //% second.min=0 second.max=10 second.defl=1
    export function driveForwards(second: number): void {
        basic.pause(second * 1000);
    }

    //% color="#808080" weight=82 block="forward |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function forward(step: number): void {
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        回転数(step, step)
        左タイヤ前()
        右タイヤ前()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
    }

    //% color="#808080" weight=82 block="back |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function back(step: number): void {
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        回転数(step * -1, step * -1)
        左タイヤ後ろ()
        右タイヤ後ろ()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
    }

    //% color="#808080" weight=80 block="right |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function right(step: number): void {
        noservo = 1
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
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        回転数(step * -1, step)
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
        if (R_bit == 1 && noservo == 1) {
            P1count += 1
            serial.writeValue("R", P1count)
            if (P1count < Math.abs(目標P1)) {
                if (P1count + 15 < Math.abs(目標P1)) {
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
        if (L_bit == 1 && noservo == 1) {
            P0count += 1
            serial.writeValue("L", P0count)
            if (P0count < Math.abs(目標P0)) {
                if (P0count + 15 < Math.abs(目標P0)) {
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



    //% color="#3943c6" weight=88 blockId=moving2
    //% block="Move |%sinkou_houkou|,power|%Power|" group="1 Basic movement"
    //% Power.min=0 Power.max=255 Power.defl=120
    export function car_derection(sinkou_houkou: direction, Power: number): void {
        let noservo = 0
        switch (sinkou_houkou) {
            case direction.forward:
                pins.analogWritePin(AnalogPin.P2, Power)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, Power)
                break;
            case direction.left:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, Power)
                break;
            case direction.right:
                pins.analogWritePin(AnalogPin.P2, Power)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, 0)
                break;
            case direction.right_rotation:
                pins.analogWritePin(AnalogPin.P2, Power)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, Power)
                pins.analogWritePin(AnalogPin.P16, 0)
                break;
            case direction.left_rotation:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, Power)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, Power)
                break;
            case direction.backward:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, Power)

                pins.analogWritePin(AnalogPin.P15, Power)
                pins.analogWritePin(AnalogPin.P16, 0)
                break;
            case direction.Stop:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, 0)
                break;
        }
    }





    //% color="#009A00" weight=22 blockId=sonar_ping_2 block="Distance sensor" group="6 Ultrasonic_Distance sensor"
    //% advanced=true
    export function sonar_ping_2(): number {
        let d1 = 0;
        let d2 = 0;

        for (let i = 0; i < 5; i++) {
            // send
            basic.pause(5);
            pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
            pins.digitalWritePin(DigitalPin.P12, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P12, 1);
            control.waitMicros(10);
            pins.digitalWritePin(DigitalPin.P12, 0);
            // read
            d1 = pins.pulseIn(DigitalPin.P10, PulseValue.High, 500 * 58);
            d2 = d2 + d1;
        }
        return Math.round(Math.idiv(d2 / 5, 58) * 1.5);
    }

    //% color="#009A00" weight=30 block="(minimam 5cm) dstance |%limit| cm  |%nagasa| " group="6 Ultrasonic_Distance sensor"
    //% limit.min=5 limit.max=30
    //% advanced=true
    export function sonar_ping_3(limit: number, nagasa: kyori): boolean {
        let d1 = 0;
        let d2 = 0;
        if (limit < 8) {
            limit = 8
        }
        for (let i = 0; i < 5; i++) {
            // send
            basic.pause(5);
            pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
            pins.digitalWritePin(DigitalPin.P12, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P12, 1);
            control.waitMicros(10);
            pins.digitalWritePin(DigitalPin.P12, 0);
            // read
            d1 = pins.pulseIn(DigitalPin.P10, PulseValue.High, 500 * 58);
            d2 = d1 + d2;
        }
        switch (nagasa) {
            case kyori.short:
                if (Math.idiv(d2 / 5, 58) * 1.5 < limit) {
                    return true;
                } else {
                    return false;
                }
                break;
            case kyori.long:
                if (Math.idiv(d2 / 5, 58) * 1.5 < limit) {
                    return false;
                } else {
                    return true;
                }
                break;
        }
    }


    //% color="#f071bd" weight=30 blockId=auto_photo_R block="right_photoreflector" group="7 photoreflector"
    //% advanced=true
    export function phto_R() {
        return pins.digitalReadPin(DigitalPin.P4);
    }

    //% color="#f071bd" weight=28 blockId=auto_photo_L block="left_photoreflector" group="7 photoreflector"
    //% advanced=true
    export function phto_L() {
        return pins.digitalReadPin(DigitalPin.P3);
    }


    //% color="#6041f1"  weight=33 block="only right |%wb| " group="7 photoreflector"
    //% sence.min=10 sence.max=40
    //% advanced=true
    export function photo_R_out(wb: whiteblack): boolean {

        switch (wb) {
            case whiteblack.black:
                if ((pins.digitalReadPin(DigitalPin.P3) == 1) && (pins.digitalReadPin(DigitalPin.P4) == 0)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case whiteblack.white:
                if ((pins.digitalReadPin(DigitalPin.P3) == 0) && (pins.digitalReadPin(DigitalPin.P4) == 1)) {
                    return true;
                } else {
                    return false;
                }
                break;
        }
    }

    //% color="#6041f1"  weight=34 block="onle left |%wb|" group="7 photoreflector" 
    //% advanced=true
    export function photo_L_out(wb: whiteblack): boolean {


        switch (wb) {
            case whiteblack.black:
                if

                    ((pins.digitalReadPin(DigitalPin.P3) == 0) && (pins.digitalReadPin(DigitalPin.P4) == 1)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case whiteblack.white:
                if ((pins.digitalReadPin(DigitalPin.P3) == 1) && (pins.digitalReadPin(DigitalPin.P4) == 0)) {
                    return true;
                } else {
                    return false;
                }
                break;
        }
    }
    //% color="#6041f1"  weight=35 block="Both |%wb| " group="7 photoreflector"
    //% advanced=true
    export function photo_LR_out(wb: whiteblack): boolean {

        switch (wb) {
            case whiteblack.black:
                if
                    ((pins.digitalReadPin(DigitalPin.P3) == 0) && (pins.digitalReadPin(DigitalPin.P4) == 0)) {
                    return true;
                } else {
                    return false;
                }
                break;

            case whiteblack.white:

                if
                    ((pins.digitalReadPin(DigitalPin.P3) == 1) && (pins.digitalReadPin(DigitalPin.P4) == 1)) {
                    return true;
                } else {
                    return false;
                }
                break;
        }

    }

    //% color="#009A00"  weight=19 blockId=microbit2_decideLight block="m:bitOptical sensor value |%limit| Darker" group="8 microbit Optical_sensor"
    //% limit.min=0 limit.max=100
    //% advanced=true
    export function microbit2_decideLight(limit: number): boolean {
        if (input.lightLevel() / 254 * 100 < limit) {
            return true;
        } else {
            return false;
        }
    }



    //% color="#009A00"  weight=17 blockId=microbit2_denkitemp block="m:bitOptical sensor value" group="8 microbit Optical_sensor"
    //% advanced=true
    export function microbit2_denkitemp(): number {

        return Math.round(input.lightLevel() / 254 * 100);

    }

    /*
        //% color="#228b22"  weight=16 blockId=microbit2_denkiLED block="m:bit Optical sensor value" group="8 microbit Optical_sensor"
        //% advanced=true
        export function microbit2_denkiLED() {
            basic.showNumber(Math.round(input.lightLevel() / 254 * 100));
        }
    */







}