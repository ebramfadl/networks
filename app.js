const cookieParser = require('cookie-parser');
var express = require('express');
var server = express();
var path = require('path');
var bodyParser = require('body-parser');
var sessions = require('express-session');


server.set('views',path.join(__dirname, 'views'));
server.set('view engine','ejs');



server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.json());
server.use(cookieParser());




server.use(sessions({
  secret : "6436A1449Y16408N2168J18094E-JAENY-May-FEB-DEC-OCT",
  saveUninitialized:true,
  cookie : {maxAge : 1000*60*60*60*5},
  resave : true
}));


var session 

  
const {connectToDb , getDb} = require('./db');

let db

connectToDb((err)=> {
  if(!err){
    server.listen(3000, ()=>{
      console.log("SERVER IS LISTENING ON PORT 3000")
    })
    db = getDb()
  }
  else{
    console.log(err);
  }

})

///////////////////////////////////////////////////////////////////////////////////////////


server.get('/', (request,response) => {
  
  response.render('login');

})

//Log in
server.post('/', async (request,response) =>{

  var name = request.body.username;
  var pass = request.body.password;

  const user = await User.findOne({username:name,password:pass});

  if(user === null){
    var content = "You are not signed up, Please create an account!";
    response.render('message',{content});
    return;
  }

  session = request.session
  session.userid = request.body.username

  console.log(user);
  response.render('home');

})









