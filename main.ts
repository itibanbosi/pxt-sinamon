input.onButtonPressed(Button.A, function () {
    basic.pause(5000)
    for (let index = 0; index < 4; index++) {
        sinamon.forward_cm(15)
        sinamon.left_degree(90)
        sinamon.forward_cm(15)
        sinamon.right_degree(90)
    }
})
