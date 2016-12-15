var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sketchy' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chat Sample' }); 
  res.send({hi : 'hello'}) 
});

//session test
router.get('/hello' ,  function(request, response, next ) {
  let sess = request.session; 
  sess.hello = 'hello world' 
  response.send( sess.hello )
  response.send({hi: 2})
})
router.get('/hello2' ,  function(request, response, next ) {
  let sess = request.session; 
  response.send( sess.hello )
})

router.get( '/game/:id', function( request, response ) {
  //response.send( 'Your game is ' + request.params.id )
  response.render('game' , {title: 'Sketchy' , gameid : request.params.id })
});

router.get('/sendme', function(res,rep){
   response.send({hi : 'hello'})
})
module.exports = router;
