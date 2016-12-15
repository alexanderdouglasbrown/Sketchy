

// const socket = io();
//const UUID = require('../UUID/v4');

$(document).ready(function () {

  $('#messages form').submit(function () {
    const val = $('#messages input').val();
    if (val.length > 0) {
      socket.emit('chat message', val);
      $('#messages input').val('');

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
    window.location = '/game/' + event.target.id
    //$.post('/loadgame', {roomid : event.target.id});
    //
  });

  socket.on('newgame', data => {
    $('.activegames').prepend('<li><a class = "games list-group-item default" id = "' + data.gameroomid + '" > ' + data.gameroomname + '</a></li>');
  });

  $('#gamerooms form').submit(event => {
    const roomname = $('#gamerooms input').val();
    if (roomname.length > 0) {
      socket.emit('createroom', roomname);
      $('#gamerooms input').val('');

      //console.log('its working' );
      //socket.emit('returnToLobby', true );
    }
    return false;
  });
});
