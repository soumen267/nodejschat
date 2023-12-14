//To get HTML elements
var output = document.getElementById('output');
var message = document.getElementById('message');
var send = document.getElementById('send');
var feedback = document.getElementById('feedback');
var roomMessage = document.querySelector('.room-message');
var users = document.querySelector('.users');

//Socket server URL
var socket = io.connect('http://localhost:3000/');



//Fetch URL Params from URL
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var username = urlParams.get('username');
var roomname = urlParams.get('roomname');
console.log(username, roomname);

//Display the roomname the user is connected to
roomMessage.innerHTML = `Connected in room ${roomname}`

//Emitting username and roomname of newly joined user to server
socket.emit('joined-user', {
    username: username,
    roomname: roomname
})

//Sending data when user clicks send
send.addEventListener('click', () =>{
    socket.emit('chat', {
        username: username,
        message: message.value,
        roomname: roomname
    })
    message.value = '';
})

//Sending username if the user is typing
message.addEventListener('keypress', () => {
    socket.emit('typing', {username: username, roomname: roomname})
})

//Displaying if new user has joined the room
socket.on('joined-user', (data)=>{
    output.innerHTML += '<p>--> <strong><em>' + data.username + ' </strong>has Joined the Room</em></p>';
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    output.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})

//Displaying if a user is typing
socket.on('typing', (user) => {
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
})

//Displaying online users
socket.on('online-users', (data) =>{
    users.innerHTML = ''
    data.forEach(user => {
        users.innerHTML += `<p>${user}</p>`
    });
})