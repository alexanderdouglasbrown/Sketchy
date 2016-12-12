  const socket = io();

  $(document).ready( function() {
  
  $('#messages form').submit( function() {
    const val = $('#messages input').val() ;
    if (val.length > 0){
      socket.emit('chat message', val);
      $('#messages input').val('');
      
    }
    return false;
    });   
    
    socket.on('chat message', msg => {
       $('.messages').append('<div class = "message"> ' + msg + '</div>');
    });
    
    socket.on('playerList', newplayer => {
        console.log(newplayer);
       $('.users').append('<div class = "online" id = ' + newplayer +' > ' + newplayer + '</div>');
    });
    
    socket.on('playerDelete', id => {
      $('#' + id ).remove();
      
    }); 
    
    $( '#playerlist').click( event => {
      var message = "Private messaging : " + event.target.id;
      //socket.in(event.target.id)
      socket.emit('private-chat', event.target.id);
  });
     $('#lobbybutton').click( event => {
       socket.emit('returnToLobby', true );
     });
});
