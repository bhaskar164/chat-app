module.exports.createMessageTable = (con) => {
  let sqlQuery = `create table message(reciever_id int not null, sender_id int not null, messg varchar(1000) time datetime);`;
  con.query(sqlQuery, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Message Table Created Successfully!");
    }
  });
};
