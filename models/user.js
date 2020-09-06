module.exports.createUserTable = (con) => {
  let sqlQuery = `create table user(userid int not null auto_increment primary key, username varchar(100), password varchar(100))`;
  con.query(sqlQuery, (err) => {
    if (err) {
      console.log("Error occured! while creating user table!");
    } else {
      console.log("Successfully createrd User Table!");
    }
  });
};
