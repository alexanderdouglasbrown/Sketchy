const game = {
    waitLength: 5,
    gameLength: 120,
    timerInterval: null,
    word: null,
    gameStarted: false,
    timeRemaining: 0,
    statusMessage: "Waiting for a second player..."
}

socket.on('consoleOut', (package) => {
    console.log(package)
})

socket.on('updateStatus', (package) => {
    $('#status p').html(package)
})

socket.on('getStatus', (from) => {
    socket.emit('sendStatus', { message: game.statusMessage, to: from })
})

socket.on('setWord', (word) => {
    game.word = word
    $('#status p').html("Draw: " + game.word)
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
    game.statusMessage = "Game halted. Not enough players"
    $('#status p').html(game.statusMessage)
    $('#timer').html("")
    resetThings()
})

socket.on('setReadOnly', () => {
    toggleReadOnly(true)
})

socket.on('youarehost', (package) => {
    game.statusMessage = username + " is up. Game is about to begin"
    socket.emit('send_updateStatus', { message: game.statusMessage, roomid: roomid, host: username })
    $('#status p').html("You're up next")
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
    game.statusMessage = "Guess the word in the chat room"
    socket.emit('send_updateStatus', { message: game.statusMessage, roomid: roomid, host: username })

    game.timeRemaining = game.gameLength
    toggleReadOnly(false)
    setWord()
}

function findNewHost() {
    resetThings()
    socket.emit('findANewHost', { roomid: roomid, playerid: playerid })
}

function setWord() {
    socket.emit('getWord', roomid)
}

function resetThings() {
    toggleReadOnly(true)
    game.gameStarted = false
    clearInterval(game.timerInterval)
}

$('#skip').click(() => {
    game.timeRemaining -= 10
    socket.emit('skip', roomid)
    setWord()
})