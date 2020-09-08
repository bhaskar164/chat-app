var clientSocket = io();

let messageDisplay = document.querySelector('.output');
let messageBox = document.querySelector('.message_form__input');
// let uid = 1;
let send = () => {
    let messageVal = messageBox.value;
    clientSocket.emit('message', messageVal);
    messageDisplay.innerHTML += `<li>you sent:- ${messageVal}</li>`;
    messageBox.value = "";
};




// clientSocket.emit('message', 'hey server@');
clientSocket.on('message', (data) => {
    messageDisplay.innerHTML += `<li>you recieved:- ${data}</li>`;
})