// console.log(gameid);

const artpad = {
    canvas: document.getElementById("artpadCanvas"),
    context: null,
    width: 500,
    height: 500,
    isHolding: false,
    brushSize: 5,
    history: [],
    lastChange: [],
    dirtyUndo: false,
    mirror_isHolding: false,
    clearWasPressed: false,
    readOnly: true,
    tempLocked: false,
    fadeCounter: 60,
    fadeInterval: null
}

let payload = []

$('#artpadCanvas').ready(() => {

    artpad.canvas.width = artpad.width
    artpad.canvas.height = artpad.height
    artpad.context = artpad.canvas.getContext("2d")

    setInterval(sendPayload, 66)

    artpad.context.fillStyle = "white"
    artpad.context.fillRect(0, 0, artpad.width, artpad.height)
    artpad.context.lineWidth = artpad.brushSize
    artpad.context.lineJoin = "round"
    artpad.context.lineCap = "round"
    artpad.context.strokeStyle = "black"

})


$('#artpadCanvas').mousedown(pressDown)
$('#artpadCanvas').on("touchstart", pressDown)

$('#artpadCanvas').mousemove(pressMove)
$('#artpadCanvas').on("touchmove", pressMove)

$(window).on("mouseup", cancelMouseHold)
$('#artpadCanvas').on("touchend", cancelMouseHold)

$(window).on("blur", cancelMouseHold)
$('#artpadCanvas').on("touchcancel", cancelMouseHold)

function pressDown(e) {
    if (!artpad.readOnly && !artpad.tempLocked) {
        e = e || window.event
        const mouseX = (e.pageX - this.offsetLeft + 1)
        const mouseY = (e.pageY - this.offsetTop + 1)
        e.preventDefault()

        if (artpad.dirtyUndo)
            artpad.lastChange = []

        //Clear the history after a clear screen so history doesn't inflate
        if (artpad.clearWasPressed && !artpad.dirtyUndo) {
            artpad.history = []
            artpad.clearWasPressed = false
        }

        while (artpad.lastChange.length > 0)
            artpad.history.push(artpad.lastChange.pop())

        artpad.isHolding = true
        artpad.dirtyUndo = false

        artpad.context.beginPath()
        artpad.context.moveTo(mouseX, mouseY)

        paint(mouseX + 0.4, mouseY + 0.4)
        buildPayload(mouseX, mouseY, true, artpad.context.strokeStyle)
        buildLastChange(mouseX, mouseY, true, artpad.context.strokeStyle)
    }
}

function pressMove(e) {
    if (artpad.isHolding && !artpad.readOnly && !artpad.tempLocked) {
        e = e || window.event
        const mouseX = (e.pageX - this.offsetLeft + 1)
        const mouseY = (e.pageY - this.offsetTop + 1)
        paint(mouseX, mouseY)
        buildPayload(mouseX, mouseY, true, artpad.context.strokeStyle)
        buildLastChange(mouseX, mouseY, true, artpad.context.strokeStyle)
    }
}

function cancelMouseHold() {
    if (!artpad.readOnly) {
        artpad.isHolding = false

        buildPayload(null, null, false, artpad.context.strokeStyle)
        buildLastChange(null, null, false, artpad.context.strokeStyle)
    }
}

function paint(mouseX, mouseY) {
    artpad.context.lineTo(mouseX, mouseY)
    artpad.context.stroke()
}

function buildPayload(mouseX, mouseY, isHolding, color) {
    const payloadData = {
        mouseX: mouseX,
        mouseY: mouseY,
        isHolding: isHolding,
        color: color
    }
    payload.push(payloadData)
}

function buildLastChange(mouseX, mouseY, isHolding, color) {
    const payloadData = {
        mouseX: mouseX,
        mouseY: mouseY,
        isHolding: isHolding,
        color: color
    }
    artpad.lastChange.push(payloadData)
}

function sendPayload() {
    if (!artpad.readOnly) {
        socket.emit('mirror-payload', {
            payload: payload
        })
        payload = []
    }
}

socket.on('mirror-package', (package) => {
    drawContent(package.payload)
})

socket.on('resync', () => {
    if (!artpad.readOnly) {
        payload = []

        for (let i = 0; i < artpad.history.length; i++)
            payload.push(artpad.history[i])

        if (!artpad.dirtyUndo) {
            artpad.lastChange.unshift([null, null, false, null])

            for (let i = 0; i < artpad.lastChange.length; i++)
                payload.push(artpad.lastChange[i])
        }
        payload.push([null, null, false, null])
    }
})

socket.on('artpad victory', () => {
    if (!artpad.tempLocked) {
        cancelMouseHold()
        artpad.tempLocked = true
        artpad.context.globalAlpha = 0.15
        artpad.fadeInterval = setInterval(fadeout, 16)
    }
})

function fadeout() {
    artpad.context.fillRect(0, 0, artpad.width, artpad.height)
    artpad.fadeCounter--
    if (artpad.fadeCounter <= 0) {
        artpad.context.globalAlpha = 1
        artpad.tempLocked = false
        artpad.fadeCounter = 60
        clearInterval(artpad.fadeInterval)
        if (!artpad.readOnly) {
            clearButton()
        }
    }
}

function clearScreen() {
    artpad.context.fillRect(0, 0, artpad.width, artpad.height)
}

function sendClearScreen() {
    buildPayload(null, null, null, "clear")
}

function drawContent(package) {
    for (let i = 0; i < package.length; i++) {
        let current = package[i]

        if (current.color == "clear") {
            clearScreen()
            continue
        }

        if (current.color == "beginPath") {
            artpad.context.beginPath()
            continue
        }

        if (current.color == "#ffffff") { //White / Eraser
            artpad.context.lineWidth = 30
        } else {
            artpad.context.lineWidth = artpad.brushSize
        }

        if (artpad.context.strokeStyle != current.color && current.color != null) {
            artpad.context.strokeStyle = current.color
        }

        if (!artpad.mirror_isHolding && current.isHolding) { //Simulate initial click
            artpad.context.beginPath()
            artpad.context.moveTo(current.mouseX, current.mouseY)
            artpad.mirror_isHolding = true

            paint(current.mouseX + 0.4, current.mouseY + 0.4)
        } else {
            artpad.mirror_isHolding = current.isHolding

            if (artpad.mirror_isHolding) {
                paint(current.mouseX, current.mouseY)
            }
        }
    }
}
//Buttons

$('#blackBrush').click(() => {
    setBrush("black")
})

$('#redBrush').click(() => {
    setBrush("red")
})

$('#orangeBrush').click(() => {
    setBrush("orange")
})

$('#greenBrush').click(() => {
    setBrush("green")
})

$('#tealBrush').click(() => {
    setBrush("teal")
})

$('#blueBrush').click(() => {
    setBrush("blue")
})

$('#eraser').click(() => {
    setBrush("eraser")
})

$('#clear').click(() => {
    clearButton()
})

function clearButton() {
    clearScreen()
    sendClearScreen()

    //Prep undo function
    if (artpad.dirtyUndo)
        artpad.lastChange = []

    artpad.dirtyUndo = false
    artpad.clearWasPressed = true

    //Send signal that cursor was lifted so line doesn't jump
    artpad.lastChange.unshift([null, null, false, null])

    for (let i = 0; i < artpad.lastChange.length; i++)
        artpad.history.push(artpad.lastChange[i])

    artpad.lastChange = []
    sendClearScreen()
    buildLastChange(null, null, null, "clear")
}

$('#undo').click(() => {
    undo()
})

function undo() {
    let brushStore = artpad.context.strokeStyle
    if (!artpad.dirtyUndo) {
        artpad.dirtyUndo = true

        clearScreen()

        payload = []
        sendClearScreen()
        for (let i = 0; i < artpad.history.length; i++)
            payload.push(artpad.history[i])

        drawContent(artpad.history)

    } else {
        artpad.dirtyUndo = false
        artpad.context.beginPath()

        payload = []
        for (let i = 0; i < artpad.lastChange.length; i++)
            payload.push(artpad.lastChange[i])

        drawContent(artpad.lastChange)
    }
    buildPayload(null, null, null, "beginPath")
    setBrush(brushStore)
}

function setBrush(color) {
    if (color == "black" || color == "#000000") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorBlack.png) 2 2, auto ')
        clearHighlights()
        $('#blackBrush').attr('src', '/images/artpad/highlightBlack.png')
        artpad.context.lineWidth = artpad.brushSize
        artpad.context.strokeStyle = "black"
    }
    else if (color == "red" || color == "#ff0000") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorRed.png) 2 2, auto ')
        clearHighlights()
        $('#redBrush').attr('src', '/images/artpad/highlightRed.png')
        artpad.context.lineWidth = artpad.brushSize
        artpad.context.strokeStyle = "red"
    }
    else if (color == "orange" || color == "#ffa500") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorOrange.png) 2 2, auto ')
        clearHighlights()
        $('#orangeBrush').attr('src', '/images/artpad/highlightOrange.png')
        artpad.context.lineWidth = artpad.brushSize
        artpad.context.strokeStyle = "orange"
    }
    else if (color == "green" || color == "#008000") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorGreen.png) 2 2, auto ')
        clearHighlights()
        $('#greenBrush').attr('src', '/images/artpad/highlightGreen.png')
        artpad.context.lineWidth = artpad.brushSize
        artpad.context.strokeStyle = "green"
    }
    else if (color == "teal" || color == "#008080") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorTeal.png) 2 2, auto ')
        clearHighlights()
        $('#tealBrush').attr('src', '/images/artpad/highlightTeal.png')
        artpad.context.lineWidth = artpad.brushSize
        artpad.context.strokeStyle = "teal"
    }
    else if (color == "blue" || color == "#0000ff") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorBlue.png) 2 2, auto ')
        clearHighlights()
        $('#blueBrush').attr('src', '/images/artpad/highlightBlue.png')
        artpad.context.lineWidth = artpad.brushSize
        artpad.context.strokeStyle = "blue"
    }
    else if (color == "eraser" || color == "#ffffff") {
        $('#artpadCanvas').css('cursor', 'url(/images/artpad/cursorEraser.png) 14 14, auto ')
        clearHighlights()
        $('#eraser').attr('src', '/images/artpad/highlightEraser.png')
        artpad.context.lineWidth = 30
        artpad.context.strokeStyle = "white"
    }
}

function clearHighlights() {
    $('#blackBrush').attr('src', '/images/artpad/colorBlack.png')
    $('#redBrush').attr('src', '/images/artpad/colorRed.png')
    $('#orangeBrush').attr('src', '/images/artpad/colorOrange.png')
    $('#greenBrush').attr('src', '/images/artpad/colorGreen.png')
    $('#tealBrush').attr('src', '/images/artpad/colorTeal.png')
    $('#blueBrush').attr('src', '/images/artpad/colorBlue.png')
    $('#eraser').attr('src', '/images/artpad/eraser.png')
}

function toggleReadOnly(readOnly) {
    artpad.history = []
    artpad.lastChange = []
    payload = []
    artpad.dirtyUndo = false
    artpad.isHolding = false
    artpad.mirror_isHolding = false
    artpad.clearWasPressed = false
    artpad.context.beginPath()

    if (!readOnly) {
        artpad.readOnly = false
        clearScreen()
        sendClearScreen()
        $('#toolbar').css('visibility', 'visible')
        setBrush("black")
    } else {
        artpad.readOnly = true
        $('#toolbar').css('visibility', 'hidden')
        setBrush("black")
        $('#artpadCanvas').css('cursor', 'auto')
    }
}
