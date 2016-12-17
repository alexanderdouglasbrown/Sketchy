const game = {
    waitLength: 5,
    gameLength: 5,
    timerInterval: null,
    word: null,
    gameStarted: false,
    timeRemaining: 0
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

    if (sec < 10)
        $('#timer').html(min + ":0" + sec)
    else
        $('#timer').html(min + ":" + sec)
})

socket.on('endgame', () => {
    $('#status').html("Game halted. Host left or not enough players")
    $('#timer').html("")
    resetThings()
})

socket.on('setReadOnly', () => {
    toggleReadOnly(true)
})

socket.on('youarehost', (package) => {
    socket.emit('send_updateStatus', { message: "Game is about to begin", roomid: roomid, broadcast: true })
    $('#status').html("You're up next")
    game.timeRemaining = game.waitLength
    game.timerInterval = setInterval(iterateCountDown, 1000)
})

socket.on('youarenothost', (package) => {
    resetThings()
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

    game.timeRemaining = game.gameLength
    toggleReadOnly(false)
    setWord()
}

function findNewHost() {
    resetThings()
    socket.emit('findANewHost', { roomid: roomid, playerid: playerid })
}

function setWord() {
    getWord()
    $('#status').html("Draw: " + game.word)
}

function getWord() {
    game.word = "Cat"
}

function resetThings() {
    toggleReadOnly(true)
    game.gameStarted = false
    clearInterval(game.timerInterval)
}