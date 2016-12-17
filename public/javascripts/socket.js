

// const socket = io();
//const UUID = require('../UUID/v4');

$(document).ready(function () {

  $('#messages form').submit(function () {
    if(player === '') {
      $('#popup').modal('show');
      $('#messages input').val('')
    } else {
      const val = $('#messages input').val();
      if (val.length > 0) {
        socket.emit('chat message', getTimestamp() + ' ' + player + ' ' + val);
        $('#messages input').val('');

      }
    }
    return false;
  });

  socket.on('chat message', msg => {
    $('.messages').append('<li class = "message"> ' + msg + '</li>');
    $('#chat').scrollTop($('#chat').prop('scrollHeight'))
  });


  socket.on('playerDelete', id => {
    $('#' + id).remove();

  });

  $('#rooms').click(event => {
    //console.log(event.target.id);
    if (event.target.id != "rooms" && event.target.id != "") {
      window.location = '/game/' + event.target.id
      // socket.emit('joinRoom', event.target.id)
    }

    //$.post('/loadgame', {roomid : event.target.id});
    //
  });
  socket.on('enterRoom', roomid => {
    window.location = '/game/' + roomid
  })

  socket.on('newgame', data => {
    $('.activegames').prepend('<li><a class = "games list-group-item default" id = "' + data.gameroomid + '" > ' + data.gameroomname + '</a></li>');
  });

  $('#gamerooms form').submit(event => {
    if(player === '') {
      $('#popup').modal('show');
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
      if( timezoneOffset < 0 )
        hour += timezoneOffset
      else  
        hour -= timezoneOffset
      if( hour < 0 )
        hour += 24
      else if( hour >= 24 )
        hour -= 24
      return hour
    } 
  )()

  var currentMinutes = ( 
      () => {
      minutes = currentTime.getUTCMinutes()
      if( minutes < 10 ) 
        minute = '0' + minutes
      return minutes
    } 
  )()

  return '[' + currentHour + ':' + currentMinutes + ']'
}