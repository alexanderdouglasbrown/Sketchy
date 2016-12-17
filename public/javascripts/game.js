const game = {
    gameStarted: false,
    timeRemaining: 0 //seconds
}

socket.on('consoleOut', (package) => {
    console.log(package)
})

socket.on('updateStatus', (package) => {
    $('#status').html(package)
})

socket.on('updateTimer', (package) => {
    const min = Math.floor(package / 60)
    const sec = package % 60
    let clockpadding = ""

    if (sec < 10)
        clockpadding = "0"

    $('#timer').html(min + ":" + clockpadding + sec)
})

socket.on('setReadOnly', () => {
    toggleReadOnly(true)
})

socket.on('youarehost', (package) => {
    socket.emit('send_updateStatus', { message: "Game is about to begin", roomid: roomid, broadcast: false })
    game.timeRemaining = 5
    setInterval(iterateCountDown, 1000)
})

function iterateCountDown() {
    if (game.timeRemaining >= 0) {
        socket.emit('send_updateTimer', { message: game.timeRemaining, roomid: roomid })
        game.timeRemaining--
    } else {
        if (!game.gameStarted)
            startGame()
        else
            findNewHost()
    }
}

function startGame() {
    game.gameStarted = true
    socket.emit('send_setReadOnly', roomid)
    socket.emit('send_updateStatus', { message: "Guess the word in the chat room", roomid: roomid, broadcast: true })

    game.timeRemaining = 120
    toggleReadOnly(false)
    setWord()
}

function findNewHost() {
    clearInterval(iterateCountDown)
}

function setWord() {
    $('#status').html("Draw: " + getWord())
}

function getWord() {
    return "Cat"
}