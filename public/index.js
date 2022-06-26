$(document).ready(() => {

    let socketio = io()
    let send = $('#send')
    let list = $('#list')
    let allMessages = $('#allMessages')
    let addUser = $('#addUser')
    var allUsers = [];
    let table = $('#table');
    
    let userName = prompt("Enter UserName");
    if (userName) {
        socketio.auth = { userName };
        socketio.connect();
    }

    socketio.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          alert("Enter Valid Username");
        }
      });

    socketio.on("listUsers", (users) => {
        this.allUsers = users;
        document.getElementById("tableBody").innerHTML = '';
        users.forEach((user) => {
          user.self = user.userId === socketio.id;
          var button = $('<input/>').attr({type: "button",id: "send",value: "SEND",onclick: "sendButtonClickListener(this)"});
          document.getElementById("tableBody").innerHTML += 
            `<tr><th>${user.userId}</th><th style="padding-left:30%" >${user.userName}</th></tr>`;
        });
    });

    document.querySelector('#myForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log(e);
        let receiverName = formData.get('userName')
        let message = formData.get('message')
        console.log(this.allUsers);
        let selectedUser = this.allUsers.filter(e => receiverName == e.userName);
        console.log(selectedUser);
        if (selectedUser.length==0 || (selectedUser[0].self == true || message == '')) {
            alert("Cannot send messages to Self and message should not be empty");
            return;
        }
        console.log('hi inside client' + selectedUser[0].userId);
        socketio.emit("send text", {
            message,
            to: selectedUser[0].userId
        });
        alert('Message Sent');
    
      });

    // send.click((event) => {
    //     let text = prompt("Enter Message")
    //     if (text.trim() =='') 
    //         alert("enter text");
    //     else
    //     socketio.emit('send text', {message: text});
    // });

    socketio.on("user connected", (user) => {
        document.getElementById("tableBody").innerHTML += 
            `<tr><th>${user.userId}</th><th>${user.userName}</th></tr>`;
        list.append('<li> '+user.userName + '  connected' +' </li>');
        this.allUsers.push(user);
    });

    socketio.on('send text', (data) => {
        console.log(data);
        let senderUser = this.allUsers.filter(e => data.from == e.userId);
        console.log(senderUser);
        let m = `received message -> ${data.message} from user - ${senderUser[0].userName}`;
        allMessages.append('<li> '+m+' </li>')
    });
})