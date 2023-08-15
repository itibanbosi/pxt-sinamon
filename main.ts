basic.forever(function () {
    serial.writeNumbers([3810 * envirobit.getBlue() / envirobit.getRed() + 1391, envirobit.getLight()])
})
