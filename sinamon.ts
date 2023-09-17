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
led.enable(false)
let color_value = 0
let volt=0

pins.setPull(DigitalPin.P10, PinPullMode.PullNone)
pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
pins.setPull(DigitalPin.P4, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)

let neo_sinamon = neopixel.create(DigitalPin.P9, 2, NeoPixelMode.RGB)
neo_sinamon.setBrightness(15)

//% color="#ff4500" weight=94 
namespace sinamon {

    volt = pins.analogReadPin(AnalogPin.P1)/500*6

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

    export enum colorcycle {
        //% block="cycle1"
        cycle1,
        //% block="cycle10",
        cycle10,
        //% block="cycle42",
        cycle42,
        //% block="cylce64",
        cycle64,
        //% block="cycle256",
        cycle256
    }

    export enum colorgain {
        //% block="1×gain"
        gain1,
        //% block="4×gain",
        gain4,
        //% block="16×gain",
        gain16,
        //% block="60×gain",
        gain60
    }

    //% color="#1E90FF" weight=93 block="Wait time (sec)|%second|" group="1 sinamon"
    //% second.min=0 second.max=10 second.defl=1
    export function driveForwards(second: number): void {
        basic.pause(second * 1000);
    }

    //% color="#808080" weight=82 block="forward |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function forward(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step, step)
        L_forward()
        R_forward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }


    //% color="#808080" weight=82 block="forward |%step| cm" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function forward_cm(step: number): void {
        pins.setEvents(DigitalPin.P6, PinEventType.Edge)
        pins.setEvents(DigitalPin.P7, PinEventType.Edge)
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step*2.1, step*2.1)
        L_forward()
        R_forward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }


    //% color="#808080" weight=82 block="back |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function back(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step * -1, step * -1)
        L_backward()
        R_backward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }

    //% color="#808080" weight=82 block="back |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function back_cm(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step * -1 * 2.1, step * -1 * 2.1)
        L_backward()
        R_backward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }


    //% color="#808080" weight=80 block="right |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function right(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step, step * -1)
        L_forward()
        R_backward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }

    //% color="#808080" weight=80 block="right |%step|degree" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function right_degree(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step*0.185, step * -0.185)
        L_forward()
        R_backward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }

    //% color="#808080" weight=80 block="left |%step| step" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function left(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step * -1, step)
        L_backward()
        R_forward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)
        }
        basic.pause(300)
    }

    //% color="#808080" weight=80 block="left |%step| degree" group="1 sinamon"
    //% step.min=0 step.max=50 
    export function left_degree(step: number): void {
        //sinamon.car_derection(sinamon.direction.Stop, 0)
        basic.pause(300)
        noservo = 1
        Lmoter = 0
        Rmoter = 0
        nunber_revolution(step * -0.185, step*0.185)
        L_backward()
        R_forward()
        while (Lmoter == 0 || Rmoter == 0) {
            basic.pause(100)

        }
        basic.pause(300)
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
        pins.setEvents(DigitalPin.P6, PinEventType.None)
        pins.setEvents(DigitalPin.P7, PinEventType.None)

        switch (sinkou_houkou) {
            case direction.forward:
                pins.analogWritePin(AnalogPin.P2, Power * 8.5)
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
    smbus.writeByte(0x81, 0x00)  //0x81=10000001  RGB timing 700ms
    smbus.writeByte(0x81, 0x10)  //16×gain

    smbus.writeByte(0x80, 0x03)  //0x03を書くと動作開始
    smbus.writeByte(0x81, 0x2b)  //this.addr 0x29 0x81=10000001 0x2b=00101011
*/
    smbus.writeByte(0x81, 0xF6)  //cycle10


    smbus.writeByte(0x80, 0x03)  //0x03を書くと動作開始
    









    //% color="#ffa500"  weight=35 block="values light" group="8 color senser"
    //% advanced=true
    export function getLight(): number {

        let result: Buffer = smbus.readBuffer(0xb4, pins.sizeOf(NumberFormat.UInt16LE) * 4)

        return smbus.unpack("HHHH", result)[0]
    }

    //% color="#ffa500"  weight=35 block="values red" group="8 color senser"
    //% advanced=true
    export function getRed(): number {
        return Math.round(rgb()[0])
    }



    //% color="#ffa500"  weight=35 block="values green" group="8 color senser"
    //% advanced=true
    export function getGreen(): number {
        return Math.round(rgb()[1])
    }




    //% color="#ffa500"  weight=35 block="values blue" group="8 color senser"
    //% advanced=true
    export function getBlue(): number {
        return Math.round(rgb()[2])
    }






    export function rgb(): number[] {
        let result: number[] = raw()
        let clear: number = result.shift()
        for (let x: number = 0; x < result.length; x++) {
            result[x] = result[x] * 255 / clear
        }
        return result
    }


    export function raw(): number[] {

        let result: Buffer = smbus.readBuffer(0xb4, pins.sizeOf(NumberFormat.UInt16LE) * 4)
        return smbus.unpack("HHHH", result)
    }


    //% color="#ffa500"  weight=16 blockId=color_temp block="color Temperatures value" group="8 color senser"
    //% advanced=true
    export function color_temp(): number {
        return Math.round(3810 * getBlue() / getRed() + 1391)
    }


    //% color="#ffa500" weight=88 blockId=selectcycle
    //% block="choice |%cycle|" group="8 color senser"
    //% advanced=true
    export function selectcycle(cycle: colorcycle): void {

        switch (cycle) {
            case colorcycle.cycle1:
                smbus.writeByte(0x81, 0xFF)
                break;
            case colorcycle.cycle10:
                smbus.writeByte(0x81, 0xF6)
                break;
            case colorcycle.cycle42:
                smbus.writeByte(0x81, 0xD5)
                break;
            case colorcycle.cycle64:
                smbus.writeByte(0x81, 0xC0)
                break;
            case colorcycle.cycle256:
                smbus.writeByte(0x81, 0x00)
                break;
        }
    }

/*
    //% color="#ffa500" weight=88 blockId=selectgain
    //% block="choice |%gain|" group="8 color senser"
    //% advanced=true
    export function selectgain(gain: colorgain): void {

        switch (gain) {
            case colorgain.gain1:
                smbus.writeByte(0x8C, 0x00)
                break;
            case colorgain.gain4:
                smbus.writeByte(0x8C, 0x01)
                break;
            case colorgain.gain16:
                smbus.writeByte(0x8C, 0x10)
                break;
            case colorgain.gain60:
                smbus.writeByte(0x8C, 0x11)
                break;

        }
    }
*/

    //% color="#ffa500"  weight=16 blockId=color_ID block="color ID" group="8 color senser"
    //% advanced=true
    export function color_ID(): number {
        color_value = 0
        /*     黒:0　　赤：1　緑：2　青：3　茶色：4　白:7  */
        neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Black))


        if ((getLight() > 100) && (getLight() < 400)) {
            if ((color_temp() > 1500) && (color_temp() < 4500))  {
                color_value = 1
                neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Red))
            }
            
            if ((color_temp() > 4500) && (color_temp() < 5800))  {
                color_value = 2
                neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Green))
            }
            
            if ((color_temp() > 5800)) {
                color_value = 3
                neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Blue))
            }
        }
        else {
                if (getLight() < 50) {
                    color_value = 0
                    neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Black))
                }
                if ((getLight() > 50) && (getLight() < 100)) {
                    color_value = 4
                    neo_sinamon.showColor(neopixel.colors(NeoPixelColors.Orange))
                    }
                if (getLight() > 400) {
                    color_value = 7
                    neo_sinamon.showColor(neopixel.colors(NeoPixelColors.White))
                }
                
                

        }
    return color_value
    }




namespace smbus {
    export function writeByte( register: number, value: number): void {
        let temp = pins.createBuffer(2);
        temp[0] = register;
        temp[1] = value;
        pins.i2cWriteBuffer(0x29, temp, false);
    }


    export function readBuffer(register: number, len: number): Buffer {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(0x29, temp, false);
        return pins.i2cReadBuffer(0x29, len, false);
    }


    export function unpack(fmt: string, buf: Buffer): number[] {
        let le: boolean = true;
        let offset: number = 0;
        let result: number[] = [];
        let num_format: NumberFormat = 0;
        for (let c = 0; c < fmt.length; c++) {
            switch (fmt.charAt(c)) {
                case '<':
                    le = true;
                    continue;
                case '>':
                    le = false;
                    continue;
                case 'c':
                case 'B':
                    num_format = le ? NumberFormat.UInt8LE : NumberFormat.UInt8BE; break;
                case 'b':
                    num_format = le ? NumberFormat.Int8LE : NumberFormat.Int8BE; break;
                case 'H':
                    num_format = le ? NumberFormat.UInt16LE : NumberFormat.UInt16BE; break;
                case 'h':
                    num_format = le ? NumberFormat.Int16LE : NumberFormat.Int16BE; break;
            }
            result.push(buf.getNumber(num_format, offset));
            offset += pins.sizeOf(num_format);
        }
        return result;
    }
}
}
