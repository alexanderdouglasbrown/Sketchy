

// const socket = io();
//const UUID = require('../UUID/v4');
let gameroomcounter = 0;

$(document).ready(function () {

  $('#messages form').submit(function () {
    if (player === '') {
      $('#chatPopup').modal('show');
      $('#messages input').val('')
    } else {
      const val = $('#messages input').val();
      if (val.length > 0) {
        socket.emit('chat message', { message: val, player: username, playerid: playerid });
        $('#messages input').val('');

      }
    }
    return false;
  });

  socket.on('chat message', data => {

    if ( data.servermessage) {
      $('.messages').append('<li class = "message list-group-item servermessage"> ' + data.msg + '</li>');
    } else {
      $('.messages').append('<li class = "message list-group-item"> ' + data.msg + '</li>');
    }
    $('#chat ul').scrollTop($('#chat ul').prop('scrollHeight'))

  });

  socket.on('enableRoom', id => {
    $('#' + id).css('z-index' , '0')
  });

  socket.on('disableRoom', id => {
    $('#' + id).css('z-index' , '-1')

  });

  socket.on('deleteRoom', id => {
    $('#' + id).remove();

  });

  $('#rooms').click(event => {
    //console.log(event.target.id);
    if (event.target.id != "rooms" && event.target.id != "") {
      if (player === '') {
        $('#roomPopup').modal('show');
      } else {
        window.location = '/game/' + event.target.id
        // socket.emit('joinRoom', event.target.id)
      }
    }

    //$.post('/loadgame', {roomid : event.target.id});
    //
  });
  socket.on('enterRoom', roomid => {
    window.location = '/game/' + roomid
  })

  socket.on('newgame', data => {
    let roomcolor
    let roomimg

    switch (gameroomcounter % 6) {
      case 0:
        roomcolor = "#ffffd9"
        roomimg = "/images/sun.png"
        break
      case 1:
        roomcolor = "#ffd9d9"
        roomimg = "/images/car.png"
        break
      case 2:
        roomcolor = "#d9f4ff"
        roomimg = "/images/bird.png"
        break
      case 3:
        roomcolor = "#f4fff4"
        roomimg = "/images/tree.png"
        break
      case 4:
        roomcolor = "#f4d9ff"
        roomimg = "/images/moon.png"
        break
      case 5:
        roomcolor = "#fff4ff"
        roomimg = "/images/bunny.png"
        break
    }
    gameroomcounter++
    $('.activegames').prepend('<li><a class = "games list-group-item default" style = "background-color: ' + roomcolor + '" id = "' + data.package.gameroomid + '" > <img src=" ' + roomimg + ' "> <span class ="playercount" > [ '+data.playercount+' / '+data.limit+' ] </span> ' + data.package.gameroomname + ' </a></li>');
  });

  socket.on('updateRoomList', data => {
    $('#' + data.roomid + ' .playercount').html('[ ' +data.playercount+ ' / '+data.limit+' ] ')
  })

  $('#gamerooms form').submit(event => {
    if (player === '') {
      $('#gameRoomPopup').modal('show');
      $('#messages input').val('')
    } else {
      const roomname = $('#gamerooms input').val();
      if (roomname.length > 0) {
        socket.emit('createroom', roomname);

        $('#gamerooms input').val('');
      }
      //console.log('its working' );
      //socket.emit('returnToLobby', true );
    }
    return false;
  });
});

function getTimestamp() {
  var currentTime = new Date()
  var timezoneOffset = currentTime.getTimezoneOffset() / 60

  var currentHour = (
    () => {
      var hour = currentTime.getUTCHours()
      if (timezoneOffset < 0)
        hour += timezoneOffset
      else
        hour -= timezoneOffset
      if (hour < 0)
        hour += 24
      else if (hour >= 24)
        hour -= 24
      return hour
    }
  )()

  var currentMinutes = (
    () => {
      minutes = currentTime.getUTCMinutes()
      if (minutes < 10)
        minutes = '0' + minutes
      return minutes
    }
  )()

  return '[' + currentHour + ':' + currentMinutes + ']'
}