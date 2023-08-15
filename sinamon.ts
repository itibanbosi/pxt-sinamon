/* sinamon V0.3 1023/07/27
超音波センサ
    Tri P14
    Eco P10
左・フォトリフレクター（B input)
    P3
右・フォトリフレクター(A input)
    P4
モータードライバ
    INT1 P2
    INT2 P13
    INT3 P15
    INT4 P16
左ホイール・フォトセンサー(D input)
    P7
右ホイール・フォトセンサー(C input)
    P6
ネオピクセル用
    P9
あまり
    P0, P8, 
電圧検出
    P1
カラーセンサー
    I2C
色温度　B/R＊3810－1391

*/
let objectP0 = 0
let L_bit = 0
let L_Power = 0
let P0count = 0
let R_power = 0
let objectP1 = 0
let P1count = 0
let R_bit = 0
let Lmoter = 0
let Rmoter = 0
let noservo = 0
let color_value = 0
led.enable(false)
pins.setEvents(DigitalPin.P6, PinEventType.Edge)
pins.setEvents(DigitalPin.P7, PinEventType.Edge)
pins.setPull(DigitalPin.P10, PinPullMode.PullNone)
pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
pins.setPull(DigitalPin.P4, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
let neo_sinamon = neopixel.create(DigitalPin.P9, 2, NeoPixelMode.RGB)
neo_sinamon.setBrightness(15)
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
        nunber_revolution(step, step)
        L_forward()
        R_forward()
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
        nunber_revolution(step * -1, step * -1)
        L_backward()
        R_backward()
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
        nunber_revolution(step, step * -1)
        L_forward()
        R_backward()
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
        nunber_revolution(step * -1, step)
        L_backward()
        R_forward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
    }



    function nunber_revolution(数値: number, 数値2: number) {
        P1count = 0
        P0count = 0
        objectP0 = 数値
        objectP1 = 数値2
        R_power = 0
    }


    function R_forward() {
        pins.analogWritePin(AnalogPin.P15, R_power)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }


    function R_backward() {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.analogWritePin(AnalogPin.P16, R_power)
    }

    function R_stop() {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    function L_forward() {
        pins.digitalWritePin(DigitalPin.P2, 1)
        pins.analogWritePin(AnalogPin.P13, L_Power)
    }
    function L_backward() {
        pins.analogWritePin(AnalogPin.P2, L_Power)
        pins.digitalWritePin(DigitalPin.P13, 1)
    }


    function L_stop() {
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
            //serial.writeValue("R", P1count)
            if (P1count < Math.abs(objectP1)) {
                if (P1count + 10 < Math.abs(objectP1)) {
                    R_power = 300
                    if (P0count > P1count) {
                        R_power = 100
                    }
                    if (objectP1 == Math.abs(objectP1)) {
                        R_forward()
                    } else {
                        R_backward()
                    }
                } else {
                    R_power = 550
                    if (P0count > P1count) {
                        R_power = 400
                    }
                    if (objectP1 == Math.abs(objectP1)) {
                        R_forward()
                    } else {
                        R_backward()
                    }
                }
            } else {
                R_stop()
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
            //serial.writeValue("L", P0count)
            if (P0count < Math.abs(objectP0)) {
                if (P0count + 10 < Math.abs(objectP0)) {
                    L_Power = 300
                    if (P0count < P1count) {
                        L_Power = 100
                    }
                    if (objectP0 == Math.abs(objectP0)) {
                        L_forward()
                    } else {
                        L_backward()
                    }
                } else {
                    L_Power = 550
                    if (P0count < P1count) {
                        L_Power = 400
                    }
                    if (objectP0 == Math.abs(objectP0)) {
                        L_forward()
                    } else {
                        L_backward()
                    }
                }
            } else {
                L_stop()
                Lmoter = 1
            }
        }
    })



    //% color="#3943c6" weight=88 blockId=moving2
    //% block="Move |%sinkou_houkou|,power|%Power|" group="1 Basic movement"
    //% Power.min=0 Power.max=100 Power.defl=100
    export function car_derection(sinkou_houkou: direction, Power: number): void {
        objectP0 = 0
        L_bit = 0
        L_Power = 0
        P0count = 0
        R_power = 0
        objectP1 = 0
        P1count = 0
        R_bit = 0
        Lmoter = 0
        Rmoter = 0
        noservo = 0
        switch (sinkou_houkou) {
            case direction.forward:
                pins.analogWritePin(AnalogPin.P2, Power * 10.23)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, Power * 10.23)
                break;
            case direction.left:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, Power * 10.23)
                break;
            case direction.right:
                pins.analogWritePin(AnalogPin.P2, Power * 10.23)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, 0)
                break;
            case direction.right_rotation:
                pins.analogWritePin(AnalogPin.P2, Power * 10.23)
                pins.analogWritePin(AnalogPin.P13, 0)

                pins.analogWritePin(AnalogPin.P15, Power * 10.23)
                pins.analogWritePin(AnalogPin.P16, 0)
                break;
            case direction.left_rotation:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, Power * 10.23)

                pins.analogWritePin(AnalogPin.P15, 0)
                pins.analogWritePin(AnalogPin.P16, Power * 10.23)
                break;
            case direction.backward:
                pins.analogWritePin(AnalogPin.P2, 0)
                pins.analogWritePin(AnalogPin.P13, Power * 10.23)

                pins.analogWritePin(AnalogPin.P15, Power * 10.23)
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
            pins.digitalWritePin(DigitalPin.P14, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P14, 1);
            control.waitMicros(10);
            pins.digitalWritePin(DigitalPin.P14, 0);
            // read
            d1 = pins.pulseIn(DigitalPin.P10, PulseValue.High, 500 * 58);
            d2 = d2 + d1;
        }
        return Math.round(Math.idiv(d2 / 5, 58) * 1.5);
    }

    //% color="#009A00" weight=30 block="(minimam 5cm) dstance |%limit| cm  |%nagasa| " group="6 Ultrasonic_Distance sensor"
    //% limit.min=5 limit.max=30 limit.defl=5
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
            pins.digitalWritePin(DigitalPin.P1, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P14, 1);
            control.waitMicros(10);
            pins.digitalWritePin(DigitalPin.P14, 0);
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

    /*
    
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
    
        
            //% color="#228b22"  weight=16 blockId=microbit2_denkiLED block="m:bit Optical sensor value" group="8 microbit Optical_sensor"
            //% advanced=true
            export function microbit2_denkiLED() {
                basic.showNumber(Math.round(input.lightLevel() / 254 * 100));
            }
        */

    //% color="#ffa500"  weight=16 blockId=color_temp block="color Temperatures value" group="8 color_sensor"
    //% advanced=true
    export function color_temp() : number {
        return Math.round(3810 * envirobit.getBlue() / envirobit.getRed() + 1391)
    }

    //% color="#ffa500"  weight=16 blockId=color_light block="colorsenser light value" group="8 color_sensor"
    //% advanced=true
    export function color_light(): number {
        return Math.round(envirobit.getLight())
    }

    //% color="#ffa500"  weight=16 blockId=color_ID block="color ID" group="8 color_sensor"
    //% advanced=true
    export function color_ID(): number {
        if 
            ((color_temp() > 2000) && (color_temp() < 3000) && (envirobit.getLight() > 1000) && (envirobit.getLight() < 5000)) {
            color_value = 1
            neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Red))
            }
        else {
            if
                ((color_temp() > 4500) && (color_temp() < 6000) && (envirobit.getLight() > 1000) && (envirobit.getLight() < 5000)) {
                color_value = 2
                neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Green))
            }
            else {
                if
                    ((color_temp() > 8000) && (color_temp() < 12000) && (envirobit.getLight() > 1000) && (envirobit.getLight() < 5000)) {
                    color_value = 3
                    neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Blue))
                }
                else{
                    color_value = 0
                    neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Black))
                }
            }
        }
        return color_value
    }
}




