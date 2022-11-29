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
const { request } = require('http');
const { response } = require('express');

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

server.get('/login', (request,response) => {
  response.render('login');
})

//Log in
server.post('/', async (request,response) =>{

  var name = request.body.username; //retrieve the username value from the front end
  var pass = request.body.password;//retrieve the password value from the front end

  
  //find an object that it's username attribute has the value name and password has value pass
  //const user (will hold an object if it was found in the database otherwise it will hold Null)
  const user = await db.collection('users').findOne({username:name,password:pass});

  
  //if const user was found in the database it will hold an object otherwise will hold a NULL
  //we need to check if that user is not in the database which means that he/she does not have an account
  if(user === null){
    var content = "You are not signed up, Please create an account!";
    response.render('message',{content});
    return;
  }
  
  
  //the server needs to serve each user separately so each one will have it's own session 
  session = request.session 
  session.userid = request.body.username // the session id is the username of the user because it's unique for each user

  console.log(user);
  response.render('home');

})

server.get('/registration', (request,response) =>{
  response.render('registration');
  //remember that we need to create a get method for all webpages
});

server.post('/register', async (request,response) =>{
  var name = request.body.username;//retrieve the username value from the front end
  var pass = request.body.password;//retrieve the password value from the front end

  //find an object that it's username attribute has the value name that is retrieved from the front end
  //const user (will hold an object if it was found in the database otherwise it will hold Null)
  var user = await db.collection('users').findOne( {username : name});

  //this is to check if the user was found already in the database in that case display an error message
  if(user != null){
    var content  = "Username already token please choose another one";
    response.render('message',{content}); // render to the message page with a variable 'content' to be displayed as an HTML text between <h1> </h1>
    return ; // return in order not to execute the rest of the method because we don't want to add to the DB in that case
  }
  
  //to check if one of the input fields is empty
  if(name == "" || pass == ""){
    var content  = "Username or Password field is missing";
    response.render('message',{content});
    return ; // return in order not to execute the rest of the method because we don't want to add to the DB in that case
  }

  //create the user object in json notation
  //attribute username takes the value name which is retrieved from the front end
  //attribute password takes the value pass which is retrieved from the front end as well
  var user = {username : name , password : pass};

  //add it to the database (which means that someone created an account)
  //hence they can login and use the website 
  await db.collection('users').insertOne(user);

  //send that user to the login page after registeration is successful(as required in the description)
  //we use redirect to go one page back while render to go one page forward
  response.redirect('/login');

})







