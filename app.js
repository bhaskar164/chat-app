const express = require("express");
const serverSocket = require("socket.io");
const User = require("./models/user");
const Message = require("./models/message");
const bodyParser = require("body-parser");
let session = require('express-session');
// let uid = 1;

//create mysql database connection
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "bhaskar",
  password: "bhaskar",
  database: "chat_app",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

//Creating Tables/Schema for users and messages!
//*****CAUTION********
// *****RUN next two lines Only once*****
// User.createUserTable(con);
// Message.createMessageTable(con);


// App setup
const PORT = 5000;
const app = express();



const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});



//Creating express-session must be on top
app.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session._id;
  res.locals.isLogged = req.session.loggedIn;
  next();
});
// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     secure: true --->>by removing this i am getting user id in sessions otherwise not
//   }
// }));


// Static files access in public folder
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));



//~~~~~~~~~~Socket setup on server side~~~~~~~~~~~~\
/////////////Working great if written after starting the session!////////////////
const io = serverSocket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
  // console.log(socket);
  console.log("connected", socket.connected);

  //make sure to handle all the events using "socket"
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("message", data);
  });

  // socket.emit('message', 'hey client!');
});






//GET routes
// app.get(/)---> this route is automatically resnder index.html from public folder

app.get('/', (req, res) => {
  // console.log(req.session);
  res.render('index');
});

app.get("/signup", (req, res) => {
  // console.log(req.session._id);
  res.render("signup");
});

app.get('/login', (req, res) => {
  // console.log(req.session);
  res.render('login');
});
app.get('/logout', (req, res) => {
  req.session.loggedIn = false;
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/');

});

app.get('/chat', (req, res) => {
  // console.log(req.session);
  res.render('chat');
});

//POST ROUTES

//Register New User
app.post("/signup", (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  let sqlCheckUser = 'select username from user where username = ?'; //check wheather a user already existed?
  con.query(sqlCheckUser, [email], (err, data) => {
    if (err) {
      console.log(err);
    } else if (data.length == 0) { //if no user find then add to database
      let sqlAddUser = 'insert into user(username, password) values(?,?)';
      con.query(sqlAddUser, [email, pass], (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("New User added successfully!");
          res.redirect('/login');
        }
      });
    } else { //if user found then redirect to login 
      res.redirect('/login');
    }
  });
});

//loging In the user
app.post('/login', (req, res) => {
  let loginUser = req.body.email;
  let password = req.body.password;
  // console.log(req.session);
  // console.log(loginUser, " ", password);
  let loginUserSql = 'select userid from user where username=? and password=?';
  con.query(loginUserSql, [loginUser, password], (err, data) => {
    if (err) {
      console.log(err);
      res.redirect('/signup');
    } else {
      if (data.length == 0) {
        res.redirect('/')
      } else {
        // console.log(data[0].userid);
        req.session._id = data[0].userid;
        req.session.loggedIn = true;
        // console.log('***********');
        // console.log(req.session);
        res.redirect('/chat');
      }
    }

  });
  // res.send('Working!');
});