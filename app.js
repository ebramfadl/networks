const cookieParser = require('cookie-parser');
var express = require('express');
var server = express();
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var User = require('./model/user');
const { request } = require('http');
const { response } = require('express');


server.set('views',path.join(__dirname, 'views'));
server.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser : true, useUnifiedTopology:true})
.then( () => { console.log("MONGO CONNECTION OPEN") } )
.catch( err => { console.log("OH NO MONGO CONNECTION ERROR!!!!") ;
console.log(err)} );

server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.json());
server.use(cookieParser());


// var userOneList = ["madrid","cairo","el5artoum"];
// var userOne = new User( {username:"janaabubakr" , password :"12345"});
// userOne.wishList = userOneList;

// var userTwoList = ["paris","alex","addis ababa"];
// var userTwo = new User( {username:"arwagad" , password :"456789"});
// userTwo.wishList = userTwoList;

// async function fun(){
//   await userTwo.save();
// }


// fun();


server.use(sessions({
  secret : "6436A1449Y16408N2168J18094E-JAENY-May-FEB-DEC-OCT",
  saveUninitialized:true,
  cookie : {maxAge : 1000*60*60*60*5},
  resave : true
}));


var session 

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
    var content = "You are not signed in, Please create an account";
    response.render('message',{content});
    return;
  }

  session = request.session
  session.userid = request.body.username

  console.log(user);
  response.render('home');

})



server.listen(3000);






