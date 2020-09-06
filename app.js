const express = require("express");
const serverSocket = require("socket.io");
const User = require("./models/user");
const Message = require("./models/message");
// let uid = 1;

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});


// Static files access in public folder
app.use(express.static("public"));

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
//*****CAUTION:- RUN next two lines Only once*****
// User.createUserTable(con);
// Message.createMessageTable(con);

//~~~~~~~~~~Socket setup on server side~~~~~~~~~~~~
const io = serverSocket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
  // console.log(socket);
  console.log('connected', socket.connected);

  //make sure to handle all the events using "socket"
  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('message', 'Recieved');
  });

  // socket.emit('message', 'hey client!');
});




// io.on("hey i am client", (msg) => {
//   console.log(msg);
// });